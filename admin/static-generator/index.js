const { spawn } = require("child_process");

const types = {
  text: "text",
  progress: "progress",
};
const isProduction = process.env.NODE_ENV === "production";
const linkscrape = require("./linkscrape");
const linkStore = new Set();

const hasValidLink = chunk => {
  const data = chunk.toString("utf8");
  const dataArr = data.split(" ");
  console.log("dataArr :", dataArr);
  if (data.length >= 3) {
    const url = dataArr[2];
    if (url && url.toString().indexOf("http") >= 0) {
      return true;
    }
  }
  return false;
};

module.exports.generateStaticAssets = async (req, res) => {
  try {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    if (!isProduction) {
      return res.end(
        JSON.stringify({
          type: types.text,
          message: "Cannot process this request in non production mode",
        }),
      );
    }

    const scrape = require("website-scraper");
    await scrape({
      urls: ["http://localhost:4040"],
      urlFilter: url => {
        return (
          url.startsWith("http://localhost:4040") &&
          url.indexOf("/admin/") === -1
        );
      }, // Filter links to other websites
      recursive: true,
      maxRecursiveDepth: 6,
      filenameGenerator: "bySiteStructure",
      directory: "lp",
      request: {
        headers: {
          static: true,
        },
      },
    });

    res.end(JSON.stringify({ type: types.progress, message: 100 }));
  } catch (error) {
    res.end(JSON.stringify({ type: types.text, message: error.message }));
  }
};

module.exports.createPullRequest = (req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  const exec = require("child_process").exec;
  const testscript = exec("sh ./admin/static-generator/createPr.sh");

  testscript.stdout.on("data", chunk => {
    const data = chunk.toString("utf8");
    res.write(JSON.stringify({ type: types.text, message: data }));
  });

  testscript.on("data", function(err) {
    res.end(JSON.stringify({ type: types.text, message: err.message }));
  });

  testscript.on("close", function() {
    res.end(JSON.stringify({ type: types.text, message: "done" }));
  });
};

async function downloadPage(url) {
  //...
  const fetch = await fetch(url);
  const content = await fetch.text();
  require("fs").writeFileSync("./lp/", content);
}

async function getLinks() {
  await fetch("http://localhost:4040")
    .then(a => a.text())
    .then(htmlString => {
      linkscrape("http://localhost:4040", htmlString, function(links, $) {
        links.forEach(link => !linkStore.has(link) && linkStore.add(link));
        console.log(links.length); // is 6
      });
    });
}

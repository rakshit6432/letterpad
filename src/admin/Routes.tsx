/* eslint-disable no-unused-vars */
/* eslint-disable no-unreachable */
/* eslint-disable react/prop-types */
import React, { Component, Fragment } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { withRouter, RouteComponentProps } from "react-router";
import Notifications from "react-notify-toast";
import { I18nextProvider } from "react-i18next";
import { hot } from "react-hot-loader";

// Shared
import getI18nWithDefaultLang from "../shared/i18n/i18n";

// View Files
import Loader from "./components/loader";
import LoginView from "./features/login/LoginView";
import ResetPassword from "./features/login/ResetPassword";
import Articles from "./features/articles";
import CreateArticle from "./features/article/CreateArticle";
import Article from "./features/article";
import Settings from "./features/settings";
// import Media from "./features/media";
// import AuthorList from "./features/author-list";
// import Author from "./features/author";
// import AuthorCreate from "./features/author/Create";
import Taxonomy from "./features/taxonomy";
// import NavigationBuilder from "./features/navigation-builder";
import Home from "./features/home";
// import Themes from "./features/themes";
// import StaticSite from "./features/static-site";

// css
import "./public/pcss/admin.pcss";

// All files which require authorization will pass though this
import SecuredRoute from "./helpers/Secured";
import apolloClient from "../shared/apolloClient";
import { GET_OPTIONS } from "../shared/queries/Queries";
import {
  getOptions,
  getOptions_settings,
} from "../shared/queries/types/getOptions";
import { SettingOptions } from "../../types/globalTypes";

type TypeSettings = { [option in SettingOptions]: getOptions_settings } | {};

interface IState {
  settings: TypeSettings | {};
  loading: boolean;
  error: any;
}

class Routes extends Component<RouteComponentProps, IState> {
  state = {
    settings: {},
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const options = await apolloClient().query<getOptions>({
        query: GET_OPTIONS,
      });
      const data: TypeSettings = {};
      if (options && options.data && options.data.settings) {
        options.data.settings.forEach(setting => {
          if (data && setting && setting.option) {
            data[setting.option] = setting;
          }
        });
        this.setState({ settings: data, loading: false });
      }
    } catch (e) {
      this.setState({ error: e, loading: false });
    }
  }

  render() {
    const { loading, error, settings } = this.state as IState;
    if (loading || !settings) {
      return <Loader />;
    }
    if (error) {
      window.location.href = "/admin/login";
      return;
    }
    const i18nConfig = getI18nConfig(settings);

    return (
      <I18nextProvider i18n={i18nConfig}>
        <Notifications />
        <Switch>
          <Route
            exact
            path="/admin"
            render={() => <Redirect to="/admin/login" />}
          />
          <Route
            exact
            path="/admin/login"
            render={props => <LoginView router={props} settings={settings} />}
          />
          <Route
            exact
            path="/admin/reset-password/:token"
            component={props => (
              <ResetPassword {...props} {...this.props} settings={settings} />
            )}
          />
          <Fragment>
            <SecuredRoute
              exact
              path="/admin/home"
              component={Home}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/post-new"
              type="post"
              component={CreateArticle}
              layout="none"
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/posts"
              type="post"
              component={Articles}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/posts/:post_id"
              type="post"
              component={Article}
              layout="none"
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/pages"
              type="page"
              component={Articles}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/pages/:post_id"
              type="page"
              component={Article}
              layout="none"
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/tags"
              type="post_tag"
              component={Taxonomy}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/categories"
              type="post_category"
              component={Taxonomy}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/settings"
              component={Settings}
              settings={settings}
            />
            {/* <SecuredRoute
              exact
              path="/admin/navigation-builder"
              settings={settings}
              component={NavigationBuilder}
            /> */}
          </Fragment>
        </Switch>
      </I18nextProvider>
    );
  }
}

export default hot(module)(withRouter(Routes));

function getI18nConfig(settings) {
  const langOptions = JSON.parse(settings.locale.value);
  const selectedLang = Object.keys(langOptions).filter(key => langOptions[key]);
  const lang = selectedLang[0];
  return getI18nWithDefaultLang(lang);
}
// const _Routes: React.FC<RouteComponentProps<any>> = () => {
//   const { loading, error, data } = useQuery<getOptions>(GET_OPTIONS);
//   if (loading) {
//     return <Loader />;
//   }
//   const settings: any = {};

//   if (data && data.settings) {
//     data.settings.forEach(setting => {
//       if (setting && setting.option) {
//         settings[setting.option] = setting;
//       }
//     });
//   }
//   if (error) {
//     window.location.href = "/admin/login";
//     return;
//   }
// };

// <Fragment>
//             <Notifications />

//             {/* Route for pages */}
//
//
//             <SecuredRoute
//               exact
//               path="/admin/page-new"
//               type="page"
//               component={ArticleCreate}
//               settings={data}
//             />
//             {/* Route for others */}
//
//             <SecuredRoute
//               exact
//               path="/admin/media"
//               component={Media}
//               settings={data}
//             />
//             <SecuredRoute
//               exact
//               path="/admin/media/:page"
//               component={Media}
//               settings={data}
//             />
//             <SecuredRoute
//               exact
//               path="/admin/authors"
//               component={AuthorList}
//               settings={data}
//             />
//             <SecuredRoute
//               exact
//               path="/admin/authors/edit/:id"
//               component={Author}
//               settings={data}
//             />
//             <SecuredRoute
//               exact
//               path="/admin/authors/new"
//               component={AuthorCreate}
//               settings={data}
//             />
//             <SecuredRoute
//               exact
//               path="/admin/edit-profile"
//               component={Author}
//               settings={data}
//             />
//             <SecuredRoute
//               exact
//               path="/admin/static-site"
//               component={StaticSite}
//               settings={data}
//             />
//             <SecuredRoute
//               exact
//               path="/admin/navigation-builder"
//               settings={data}
//               component={NavigationBuilder}
//             />
//           </Fragment>

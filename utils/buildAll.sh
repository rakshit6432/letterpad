#!/bin/bash
themesBuilt=()

for d in client/themes/*/ ; do
    theme="$d"
    if [[ $theme != *".ignore"* ]]; then
        echo "-------------------------------------------------------------"
        printf "BUILDING THEME - $d \n"
        echo "-------------------------------------------------------------"
        STARTTIME=$(date +%s)
        yarn build:theme  --theme=$theme > /dev/null 
        ENDTIME=$(date +%s)
        ELAPSED_TIME=$(($ENDTIME - $STARTTIME))

        themesBuilt+=("$theme ------------ $ELAPSED_TIME secs")
    fi
done

printf '%s\n' "${themesBuilt[@]}"
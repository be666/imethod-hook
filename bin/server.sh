#!/usr/bin/env bash

serverPath=$1
currentVersion=$2

function fetchBuild(){

  echo "start fetch :"$1

  git fetch

  echo "start reset .... "

  git reset --hard $1

  echo "start sleep .... "

  sleep 5

  echo "end sleep .... "

  echo "start install .... "

  npm install

  sleep 5

  echo "start build .... "

  npm run build

  echo "end build .... "

  return 0
}

cd ${serverPath}

if [ $? -eq 0 ]
then

fetchBuild ${currentVersion}

sleep 5

npm run start

fi

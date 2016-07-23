#!/usr/bin/env bash

clientPath=$1

distPath=${clientPath}"/dist-web"


ln_link=${distPath}"/current"

currentVersion=$2

DIR_VERSION=${distPath}"/"${currentVersion}

BUILD_PATH=${clientPath}'/dist'

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

  echo "start build .... "

  npm run build

  echo "end build .... "

  return 0
}

cd ${clientPath}

if [ $? -eq 0 ]
then

if [ ! -d ${distPath} ];then
  mkdir -p ${distPath}
fi

if [ ! -d ${DIR_VERSION} ]; then
  fetchBuild ${currentVersion}
  sleep 5
  echo "start copy .... "
  echo ${BUILD_PATH}"/"
  echo ${DIR_VERSION}
  echo y|cp -frR ${BUILD_PATH}"/" ${DIR_VERSION}
  echo "end copy .... "
fi

if [ -L ${ln_link} ];then
  rm ${ln_link}
fi

echo "start link  .... "
ln -s ${DIR_VERSION} ${ln_link}
echo "end link .... "
echo "end hook: "${currentVersion}
fi

#!/usr/bin/env bash

HookPath=$(cd `dirname $0`; cd ../;pwd)

BASE_DIR=${HookPath}"/dist-web"

if [ ! -d ${BASE_DIR} ];then
  mkdir -p ${BASE_DIR}
fi

LN_CURRENT=${BASE_DIR}"/current"

currentVersion=$1

DIR_VERSION=${BASE_DIR}"/"${currentVersion}

BUILD_PATH=${HookPath}'/dist'

function fetchBuild(){

  echo "start fetch :"$1

  git fetch "origin"

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


if [ ! -d ${DIR_VERSION} ]; then
  fetchBuild ${currentVersion}
  sleep 5
  echo "start copy .... "
  echo ${BUILD_PATH}"/"
  echo ${DIR_VERSION}
  echo y|cp -frR ${BUILD_PATH}"/" ${DIR_VERSION}
  echo "end copy .... "
fi

if [ -L ${LN_CURRENT} ];then
  rm ${LN_CURRENT}
fi

echo "start link  .... "
ln -s ${DIR_VERSION} ${LN_CURRENT}
echo "end link .... "
echo "end hook: "${currentVersion}

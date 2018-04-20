#! /bin/bash
#!/bin/bash

echo "start deployment..."
WEB_PATH=~/wwwroot/$1

cd $WEB_PATH
echo "path=$WEB_PATH"


echo "pull source code..."
git reset --hard origin/master
git clean -f
git pull origin master
git checkout master

echo "install dependencies..."
yarn
# yarn test

yarn start
echo "Finished."

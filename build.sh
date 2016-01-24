#!/bin/bash

# install npm dependencies
npm install

# install gulp workflow dependencies
node_modules/.bin/npm-install-from --path lib/gulp

# install bower dependencies
bower install --allow-root

# build main
gulp build:d --theme html
gulp build:d --theme angular
gulp build:d --theme rtl

# build choose module
gulp build:choose --theme choose

# build docs
cd src/docs/
mkdocs build
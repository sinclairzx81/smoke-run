# Smoke-Run

Runs shell commands on file system watch events.

[![NPM package](https://badge.fury.io/js/smoke-run.svg)](https://www.npmjs.com/package/smoke-run) 

```
$ npm install smoke-run -g
```

```bash
# re-run index.js on file change

$ smoke-run ./index.js -x "node ./src/index.js"
```

## Overview

Smoke-Run is a development tool used to run and re-run shell commands on file system watch events. Useful for compile on save development workflows.

## Usage

Smoke-Run accepts a glob as its first argument followed by a seperator `--` then the shell command to run.

```
$ smoke-run <glob> -x <command>

Examples: smoke-run index.js    -x "node index.js"
          smoke-run **          -x "node index.js"
          smoke-run **.js       -x "node index.js"
          smoke-run {**,.}/*.js -x "node index.js"
```

## Tasks

```bash
npm run clean       # cleans this project
npm run pack        # builds npm pack file.
npm run install_cli # packs and installs the cli locally.
```
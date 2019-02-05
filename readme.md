# Smoke-Run

Runs shell commands on file system watch events.

```
$ npm install smoke-run -g
```

```bash
$ smoke-run ./index.js -- node ./src/index.js
```

## Overview

Smoke-Run is a development tool used to run and re-run shell commands on file system watch events. Useful for compile on save development workflows.

## Usage

Smoke-Run accepts a glob as its first argument followed by a seperator `--` then the shell command to run.

```
$ smoke-run <glob> -- <command>

Examples: smoke-run index.js    -- node index.js
          smoke-run **          -- node index.js
          smoke-run **.js       -- node index.js
          smoke-run {**,.}/*.js -- node index.js
```

## Tasks

```bash
npm run clean       # cleans this project
npm run pack        # builds npm pack file.
npm run install-cli # packs and installs the cli locally.
```
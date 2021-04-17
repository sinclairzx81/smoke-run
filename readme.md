<div align='center'>

<h1>Smoke-Run</h1>

<p>Runs shell commands on file system watch events.</p>

[![NPM package](https://badge.fury.io/js/smoke-run.svg)](https://www.npmjs.com/package/smoke-run) 

</div>

```shell
$ npx smoke-run index.js -x node index.js
#                  ^            ^
#             watch this     run this
```

## Overview

Smoke-Run is a development tool used to run and shell commands on file system watch events. It is written primarily to allow for auto restarting node scripts on save.

License MIT

## Usage

Smoke-Run accepts a `<path>` which can either be a file or directory followed by a `<command>`. Smoke-Run will run the process immediately and restart whenever it encounters a watch event on the given `<path>`.

**Example**

```
$ smoke-run <path> -x <command>

Examples: smoke-run index.js    -x "node index.js"
          smoke-run src         -x "node index.js"
```

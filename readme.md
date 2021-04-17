<div align='center'>

<h1>Smoke-Run</h1>

<p>Runs shell commands on file system watch events.</p>

[![NPM package](https://badge.fury.io/js/smoke-run.svg)](https://www.npmjs.com/package/smoke-run) 

</div>

## Usage

The following watches the file `index.js` and starts runs it on save.

```shell
$ npx smoke-run index.js -x node index.js
```

## Overview

Smoke-Run is a development tool used to run and shell commands on file system watch events. It is written primarily to allow for auto restarting node scripts on save.

License MIT

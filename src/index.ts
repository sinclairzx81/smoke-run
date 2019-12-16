/*--------------------------------------------------------------------------

MIT License

Copyright (c) smoke-run 2019 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---------------------------------------------------------------------------*/

import { readCommand, RunCommand, InfoCommand } from './command'
import { createWatcher  }                       from './watcher'
import { runShell }                             from './shell'

// -------------------------------------------------------------------------
//
// Info
//
// Prints a help message to the user and watch targets, if any.
//
// -------------------------------------------------------------------------

async function info(info: InfoCommand) {
  const buffer = []
  const green  = '\x1b[32m'
  const yellow = '\x1b[33m'
  const esc    = '\x1b[0m'

  buffer.push(...['Version 1.1.1',
  ``,
  `$ ${green}smoke-run${esc} <glob> -x <command>`,
  ``,
  `Examples: ${green}smoke-run${esc} index.js -x "node index.js"`,
  `          ${green}smoke-run${esc} **`,
  `          ${green}smoke-run${esc} **.js`,
  `          ${green}smoke-run${esc} {**,.}/*.js`,
  ``,
  ])

  const targets = info.targets.map(target => {
    return `${yellow}match${esc} ${target}`
  })

  console.log([...buffer, ...targets, ...['']].join('\n'))
}

// -------------------------------------------------------------------------
//
// Run
//
// Runs the users command. This function runs in a watch loop.
//
// -------------------------------------------------------------------------

async function run(command: RunCommand) {
  const processes = [runShell(command.command)]
  createWatcher(command.targets, async () => {
    await processes.shift()!.dispose()
    processes.unshift(runShell(command.command))
  })
}

// -------------------------------------------------------------------------
//
// Main
//
// -------------------------------------------------------------------------

async function main(args: string[]) {
  const command = readCommand(args)
  switch(command.type) {
    case 'run':  return run (command)
    case 'info': return info(command)
  }
}

main([...process.argv])
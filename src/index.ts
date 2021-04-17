/*--------------------------------------------------------------------------

MIT License

Copyright (c) smoke-run 2021 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { watch } from './runtime/watch'
import { shell }   from './runtime/shell'
import { existsSync } from 'fs'
import { join }  from 'path'


// -------------------------------------------------------------------------
// Info
// -------------------------------------------------------------------------

async function info(message: string) {
  const green = '\x1b[32m'
  const red = '\x1b[31m'
  const esc = '\x1b[0m'
  console.log([
    'Version 1.2.0',
    '',
    `$ ${green}smoke-run${esc} <path> -x <command>`,
    '',
    `Examples: ${green}smoke-run${esc} index.js -x "node index.js"`,
    `          ${green}smoke-run${esc} src -x "node src/index.js"`,
    '',
     `${red}${message}${esc}`,
    ''
  ].join('\n'))
}

// -------------------------------------------------------------------------
// Start
// -------------------------------------------------------------------------

async function start(target: string, command: string) {
  const process = [shell(command)]
  for await (const _ of watch(target)) {
    await process.shift()!.dispose()
    process.unshift(shell(command))
  }
}

// -------------------------------------------------------------------------
// Main
// -------------------------------------------------------------------------

async function main(args: string[]) {
  if(args.length < 5) return info('')
  const target  = join(process.cwd(), process.argv[2])
  if(!existsSync(target)) return info(`Error ${target} not found`)
  const execute = process.argv[3]
  if(execute !== '-x') return info(`Error Invalid process arguments`)
  const command = process.argv.slice(4).join(' ')
  await start(target, command)
}

main(process.argv)
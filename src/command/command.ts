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

import * as glob from 'glob'
import * as path from 'path'

// --------------------------------------------------------------------------
//
// Command
//
// Parses command line arguments, inclusive of expanding glob arguments if
// not already expanded by the operating system itself.
//
// --------------------------------------------------------------------------

export type Command = InfoCommand | RunCommand

export interface InfoCommand {
  type:    'info'
  targets: string[]
}

export interface RunCommand {
  type:   'run'
  targets: string[]
  command: string
}

/** Expands a glob pattern for operating systems that don't auto expand on args */
function expandGlobPattern(pattern: string): string[] {
  if(pattern.includes('*')) {
    return glob.sync(pattern, { absolute: true })
  }
  return [path.resolve(pattern)]
}

/** Parses the smoke run command line options, returns  */
export function readCommand(args: string[]): Command {
  const processName = args.shift()!
  const filePath    = args.shift()!
  if(args.length === 0) {
    return { type: 'info', targets: [] }
  }
  let gathering     = true
  const buftargets  = []
  const buffer      = []
  while(args.length > 0) {
    const next = args.shift()!
    if(next === '--') {
      gathering = false
      continue
    }
    if(gathering) {
      const paths = expandGlobPattern(next)
      buftargets.push(...paths)
    } else {
      buffer.push(next)
    }
  }
  // filter distinct on targets.
  const targets = buftargets
    .filter((value, index, result) => 
        result.indexOf(value) === index)

  // nothing to run, return info.
  if(buffer.length === 0) {
    const type = 'info'
    return { type, targets }
  } else {
    const type = 'run'
    const command = buffer.join(' ')
    return { type, targets, command }
  }
}
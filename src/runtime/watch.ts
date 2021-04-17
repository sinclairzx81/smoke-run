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

import { channel, Receiver, Debounce } from '../async/index'
import { readdirSync, statSync, existsSync, watch as fswatch } from 'fs'
import { join } from 'path'

function* findDirectories(directory: string): Generator<string> {
  const stat = statSync(directory)
  if (!stat.isDirectory()) return
  yield directory
  for (const entry of readdirSync(directory)) {
    const next = join(directory, entry)
    yield* findDirectories(next)
  }
}

function watchDirectory(directoryPath: string): Receiver<string> {  
  const [sender, receiver] = channel<string>()
  const debounce = new Debounce(100)
  const emit = () => debounce.run(() => sender.send(directoryPath))
  for (const folder of findDirectories(directoryPath)) {
    fswatch(folder, () => emit())
  }
  return receiver
}

function watchFile(filePath: string): Receiver<string> {
  const [sender, receiver] = channel<string>()
  const debounce = new Debounce(100)
  const emit = () => debounce.run(() => sender.send(filePath))
  fswatch(filePath, () => emit())
  return receiver
}

export function watch(filePath: string) {
  if(!existsSync(filePath)) throw Error(`smoke-run: No such path ${filePath}`)
  const stat = statSync(filePath)
  if(stat.isDirectory()) return watchDirectory(filePath)
  if(stat.isFile()) return watchFile(filePath)
  throw Error('smoke-run: Unknown stat for filePath')
}
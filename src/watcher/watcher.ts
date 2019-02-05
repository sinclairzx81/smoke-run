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

import { FSWatcher, watch } from 'fs'
import { resolve }          from 'path'

// --------------------------------------------------------------------------
//
// ResetTimeout
//
// A specialized reset timeout. Used to debounce file system watch
// events. Provides a run method which accept a callback. Calling
// run in quick succession will result in reset. Only the 'last'
// callback will run.
//
// --------------------------------------------------------------------------

class ResetTimeout {
  private timer!: NodeJS.Timer
  constructor(private timeout: number) {}
  public run(func: () => void) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => func(), this.timeout)
  }
}

// --------------------------------------------------------------------------
//
// Watcher
//
// Specialized Watcher type. Watches an array of files and directories
// for changes and emits a watch event back to the caller.
//
// --------------------------------------------------------------------------

export class WatchHandle {
  constructor(private watchers: FSWatcher[]) {}
  public dispose() {
    while(this.watchers.length > 0) {
      const watcher = this.watchers.shift()!
      watcher.close()
    }
  }
}

export type WatchFunction = (filePath: string) => void

export function createWatcher(pathLikes: string[], func: WatchFunction): WatchHandle {
  const reset = new ResetTimeout(100)
  return new WatchHandle(pathLikes.map(pathLike => {
    return watch(pathLike, {}, (_, filePath) => {
      reset.run(() => func(resolve(filePath)))
    })
  }))
}
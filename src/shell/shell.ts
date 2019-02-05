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

import { ChildProcess, spawn, spawnSync, execSync } from 'child_process'

// --------------------------------------------------------------------------
//
// Shell
//
// Spawns OS processes and returns to the caller a 'disposable' handle.
// Runs the inner processes via 'sh' or 'cmd' for linux and windows
// respectively.
//
// --------------------------------------------------------------------------

// Specialized termination of the linux `sh` process, Looks up the
// sub process via the 'sh' pid and terminates it before terminating
// the 'sh' process itself.

function linuxKill(sh: ChildProcess) {
  const params = ['-o', 'pid', '--no-headers', '--ppid', sh.pid.toString()]
  const result = spawnSync('ps', params, {encoding: 'utf8'})
  const pid    = parseInt(result.output[1])
  process.kill(pid, 'SIGTERM')
  sh.kill()
}

export class ShellHandle {
  private disposed: boolean
  constructor(private process: ChildProcess) {
    this.process.on('close', code => this.onClose(code))
    this.process.on('exit', code => this.onClose(code))
    this.process.stdout.setEncoding('utf8')
    this.process.stderr.setEncoding('utf8')
    this.process.stdout.on('data', (data: string) => this.onData(data))
    this.process.stderr.on('data', (data: string) => this.onData(data))
    this.disposed = false
  }

  private onData(data: string) {
    process.stdout.write(data)
  }
  private onClose(exitcode: number) {
    this.disposed = true
  }
  public dispose() {
    if(!this.disposed) {
      this.process.stdout.removeAllListeners()
      this.process.stderr.removeAllListeners()
      this.process.stdin.removeAllListeners()
      this.process.stdout.pause()
      this.process.stderr.pause()
      this.process.stdin.end()
      if(/^win/.test(process.platform)) {
        execSync(`taskkill /pid ${this.process.pid} /T /F`)
      } else {
        linuxKill(this.process)
      }
    }
  }
}

/** Resolves the operating system start command, 'cmd' for windows, 'sh' for linux. */
export function resolveOsCommand(command: string): [string, [string, string]] {
  return (/^win/.test(process.platform)) 
    ? ['cmd', ['/c', command]]
    : ['sh',  ['-c', command]]
}

/** Executes this shell command and returns a disposable handle. */
export function runShell(command: string): ShellHandle {
  const [processName, params] = resolveOsCommand(command)
  return new ShellHandle(spawn(processName, params))
}
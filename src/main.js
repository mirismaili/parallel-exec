#!/usr/bin/env node

/**
 * Created on 1402/3/5 (2023/5/26).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {B, BD, DM, N, R, T} from 'anstyle'
import {exec as legacyExec} from 'node:child_process'
import util from 'node:util'

const exec = util.promisify(legacyExec)

const controller = new AbortController()
const {signal} = controller
const commands = process.argv.slice(2)
if (!commands.length) {
  console.info('No command to execute. 👋\xA0')
  process.exit()
}

await Promise.all(
  commands.map(async (command) => {
    console.info(`▶️ ${B}Running "${BD}%s${N}"`, command, T)
    const {stdout, stderr} = await exec(command, {signal}).catch((err) => {
      controller.abort() // Abort other child processes
      console.group(`❌  ${R}The command "${BD}%s${N}" FAILED!`, command, T)
      console.error(err.toString())
      if (err.stderr) console.error(err.stderr)
      if (err.stdout) console.info(err.stdout)
      console.groupEnd()
      throw err // Reject this promise => Reject all promises
    })
    console.group(`${DM}The result of executing: "${BD}%s${N}"`, command, T)
    if (stderr) console.error(stderr)
    if (stdout) console.info(stdout)
    console.groupEnd()
  }),
).catch(() => process.exit(1))

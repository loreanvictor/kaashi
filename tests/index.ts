import { join, dirname } from 'path'
import { readFileSync, promises } from 'fs'
import { fetch } from 'cross-fetch'
import { createInterface } from 'readline'
import { redBright, blueBright, gray, cyan } from 'chalk'
import { evaluate } from '../eval'
import { empty, env, extend } from '../eval/context'
import { Loader } from '../eval/program/loader'


const readline = createInterface({
  input: process.stdin,
  output: process.stdout
})

const log = err => {
  if (err.rootMessage) {
    console.log(redBright(err.rootMessage))
    console.log(cyan(err.context.name()) + ' ' + gray(err.location))
  } else {
    console.log(err)
  }
}

const loader: Loader = {
  load(address: string, current: string) {
    let newaddr = address
    if (address.startsWith('./') || address.startsWith('../')) {
      if (current.startsWith('http://') || current.startsWith('https://')) {
        newaddr = new URL(address, current).href
      } else {
        newaddr = join(current, address)
      }
    }

    if (newaddr.startsWith('http://') || newaddr.startsWith('https://')) {
      return [
        newaddr,
        async () => {
          const response = await fetch(newaddr)
          return await response.text()
        }
      ]
    } else {
      return [
        newaddr,
        async () => (await promises.readFile(newaddr)).toString()
      ]
    }

  }
}

const context = env(
  (
    process.argv[2]
    ? extend(
        empty('shell'),
        evaluate(
          readFileSync(process.argv[2]).toString(),
          process.argv[2],
          loader,
        )
      )
    : empty('shell')
  ),
  name => process.env[name]
)

readline.setPrompt(blueBright('Kāshi > '))
readline.prompt()
readline.on('line', async line => {
  if (line) {
    readline.pause()
    try {
      console.log(await evaluate(line, '.', loader, context).value())
    } catch (err) {
      log(err)
    } finally {
      readline.prompt()
      readline.resume()
    }
  } else {
    readline.prompt()
  }
})

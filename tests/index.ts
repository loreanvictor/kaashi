import { readFileSync } from 'fs'
import { createInterface } from 'readline'
import { redBright, blueBright, gray } from 'chalk'
import { evaluate } from '../eval'
import { empty, extend } from '../eval/context'

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
})


const context = (
  process.argv[2]
  ? extend(empty(), evaluate(readFileSync(process.argv[2]).toString()))
  : empty()
)

readline.setPrompt(blueBright('Kāshi > '))
readline.prompt()
readline.on('line', async line => {
  if (line) {
    readline.pause()
    try {
      console.log(await evaluate(line, context).value())
    } catch (err) {
      if (err.rootMessage) {
        console.log(redBright(err.rootMessage))
        console.log(gray(err.ref.source.getLineAndColumnMessage()))
      } else {
        console.log(redBright(err.message))
      }
    } finally {
      readline.prompt()
      readline.resume()
    }
  } else {
    readline.prompt()
  }
})

import { readFileSync } from 'fs'
import { createInterface } from 'readline'
import { evaluate } from '../eval'
import { empty, extend } from '../eval/context'

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
})

let context = empty()

if (process.argv[2]) {
  const code = readFileSync(process.argv[2]).toString()
  context = extend(context, evaluate(code))
}

readline.setPrompt('$ ')
readline.prompt()
readline.on('line', async line => {
  readline.pause()
  try {
    const tile = evaluate(line, context)
    const val = await tile.value()
    console.log(val)
  } catch (err) {
    console.log(err.message)
  } finally {
    readline.prompt()
    readline.resume()
  }
})

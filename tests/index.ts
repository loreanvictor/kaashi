import { grammar } from 'ohm-js'
import { join } from 'path'
import { readFileSync } from 'fs'
import { evaluate } from '../eval'


const kaashiGrammar = grammar(readFileSync(join(__dirname, '..', 'grammar.ohm')).toString())
const sampleCode = readFileSync(process.argv[2]).toString()

evaluate(kaashiGrammar, sampleCode).then(async (res: any) => {
  // console.log(res)
  console.log(await res.x)
})

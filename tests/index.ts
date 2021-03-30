import { grammar } from 'ohm-js'
import { join } from 'path'
import { readFileSync } from 'fs'
import { evaluate } from '../eval'


const kaashiGrammar = grammar(readFileSync(join(__dirname, '..', 'grammar.ohm')).toString())
const sampleCode = readFileSync(process.argv[2]).toString()

evaluate(kaashiGrammar, sampleCode).then(res => {
  // console.log(res)
  // console.log(await res.x)
  // res._('c')._('x').value().then(console.log)
  res._('y').value().then(console.log)
})

import { grammar } from 'ohm-js'
import { join } from 'path'
import { readFileSync } from 'fs'
import { evaluate } from '../eval'


const kaashiGrammar = grammar(readFileSync(join(__dirname, '..', 'grammar.ohm')).toString())
const sampleCode = readFileSync(process.argv[2]).toString()

const res = evaluate(kaashiGrammar, sampleCode)
res._('y').value().then(console.log)

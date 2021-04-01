import { join } from 'path'
import { readFileSync } from 'fs'
import { grammar } from 'ohm-js'
import { empty, EvalContext } from './context'
import { Tile } from './tile'

import * as Unpack from './unpack'
import * as Eval from './eval'
import * as BlockRules from './block/rules'


const Grammar = grammar(readFileSync(join(__dirname, '..', 'grammar.ohm')).toString())
const Semantics = Grammar.createSemantics()
Semantics.addAttribute('unpacked', Unpack)
Semantics.addOperation('eval(context)', Eval)
Semantics.addOperation('blockRule(tile, context)', BlockRules)


export function evaluate(code: string, context: EvalContext = empty()): Tile<unknown> {
  const match = Grammar.match(code)

  if (match.succeeded()) {
    return Semantics(match).eval(context)
  } else {
    throw new Error(match.message)
  }
}

import { Grammar } from 'ohm-js'
import { empty } from './context'
import { Tile } from './tile'

import * as Unpack from './unpack'
import * as Eval from './eval'
import * as BlockRules from './block/rules'


export function evaluate(grammar: Grammar, code: string): Tile<unknown> {
  const match = grammar.match(code)
  const semantics = grammar.createSemantics()
  const context = empty()
  semantics.addOperation('unpack', Unpack)
  semantics.addOperation('eval', Eval)
  semantics.addOperation('blockRule', BlockRules)

  if (match.succeeded()) {
    return semantics(match).eval()(context)
  } else {
    throw new Error(match.message)
  }
}

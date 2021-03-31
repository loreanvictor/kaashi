import { Grammar } from 'ohm-js'
import { EvalContext } from './context'
import { evalExpr } from './expr/expr'
import { Tile } from './tile'

import * as Unpack from './unpack'
import * as Eval from './eval'

// TODO: re-organize these in a cleaner manner

export function evaluate(grammar: Grammar, code: string): Tile<unknown> {
  const match = grammar.match(code)
  if (match.succeeded()) {
    const semantics = grammar.createSemantics()
    const context: EvalContext = {
      evalExpr(node, context) {
        return evalExpr(node, context || this)
      },

      evalVar: (name: string) => {
        throw new Error('UNDEFINED:: ' + name)
      },
    }

    semantics.addOperation('unpack', Unpack)
    semantics.addOperation('eval', Eval)

    return semantics(match).eval()(context)
  } else {
    throw new Error(match.message)
  }
}
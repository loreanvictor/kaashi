import { Node } from 'ohm-js'
import { Tile, tile, unwrap } from './tile'

export interface EvalContext {
  evalExpr(node: Node, context?: EvalContext): Tile<unknown>
  evalVar(name: string): Tile<unknown>
}

export function extend(context: EvalContext, child: Tile<unknown>, lock?: Promise<unknown>): EvalContext {
  return {
    evalExpr(node, ctx?) {
      return context.evalExpr(node, ctx || this)
    },

    evalVar(name: string) {
      return unwrap(
        new Promise(async resolve => {
          if (lock) await lock

          const key = tile(name)
          child.has(key).then(has => {
            if (has) {
              resolve(child.get(key))
            } else {
              resolve(context.evalVar(name))
            }
          })
        })
      )
    }
  }
}

import { Node } from 'ohm-js'

export interface EvalContext {
  evalExpr(node: Node, context?: EvalContext)
  evalVar(name: string)
}

export function extend(context: EvalContext, res: any, lock?: Promise<unknown>): EvalContext {
  return {
    evalExpr(node, ctx?) {
      return context.evalExpr(node, ctx || this)
    },

    async evalVar(name: string) {
      if (lock) await lock

      if (name in res) {
        return res[name]
      } else {
        return context.evalVar(name)
      }
    }
  }
}

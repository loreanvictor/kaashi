import { Node } from 'ohm-js'
import { EvalContext, extend } from './context'
import { tile, Tile } from './tile'
import { defer } from './util'


export function evalBlock(rules: Node[], context: EvalContext) {
  const res = new Tile()
  const lock = defer()
  const ctx = extend(context, res, lock.promise)

  for (let rule of rules) {
    if (rule.child(0).ctorName === 'Key_rule') {
      const name = rule.child(0).child(0).sourceString
      const def = rule.child(0).child(1).child(0)

      const value = ctx.evalExpr(rule.child(0).child(2).child(0))

      if (def.ctorName === 'override') {
        res.set(tile(name), value)
      } else {
        throw new Error('NOT IMPLEMENTED')
      }
    } else if (rule.child(0).ctorName === 'Expr') {
      res.push(ctx.evalExpr(rule.child(0).child(0)))
    } else {
      throw new Error('NOT IMPLEMENTED!')
    }
  }

  lock.resolve()
  return res
}

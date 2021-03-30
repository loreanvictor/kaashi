import { Node } from 'ohm-js'
import { EvalContext, extend } from './context'
import { defer } from './util'


export async function evalBlock(rules: Node[], context: EvalContext) {
  return new Promise(async (resolve, reject) => {
    const res: any = []
    const lock = defer()
    const ctx = extend(context, res, lock.promise)

    for (let rule of rules) {
      if (rule.child(0).ctorName === 'Key_rule') {
        const name = rule.child(0).child(0).sourceString
        const def = rule.child(0).child(1).child(0)

        const value = ctx.evalExpr(rule.child(0).child(2).child(0))

        if (def.ctorName === 'override') {
          res[name] = value
        } else {
          reject('NOT IMPLEMENTED')
        }
      } else if (rule.child(0).ctorName === 'Expr') {
        res[res.length] = ctx.evalExpr(rule.child(0).child(0))
      } else {
        reject('NOT IMPLEMENTED!')
      }
    }

    lock.resolve()
    resolve(res)
  })
}

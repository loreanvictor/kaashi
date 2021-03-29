import { Node } from 'ohm-js'
import { EvalContext } from './context'


export async function evalBlock(rules: Node[], context: EvalContext) {
  return new Promise(async (resolve, reject) => {
    const res: any = []

    for (let rule of rules) {
      if (rule.child(0).ctorName === 'Key_rule') {
        const name = rule.child(0).child(0).sourceString
        const def = rule.child(0).child(1).child(0)

        // TODO: context should actually be updated
        const value = await context.evalExpr(rule.child(0).child(2).child(0))

        if (def.ctorName === 'override') {
          res[name] = value
        } else {
          reject('NOT IMPLEMENTED')
        }
      } else if (rule.child(0).ctorName === 'Expr') {

        // TODO: context should actually be updated
        res[res.length] = await context.evalExpr(rule.child(0).child(0))
      } else {
        reject('NOT IMPLEMENTED!')
      }
    }

    resolve(res)
  })
}

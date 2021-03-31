import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { tile, Tile, unwrap } from '../tile'


export function evalAttr(operand: Node, name: Node, context: EvalContext): Tile<unknown> {
  let operand$

  if (operand.ctorName === 'Index_operand') {
    operand$ = context.evalExpr(operand.child(0))
  } else {
    operand$ = context.evalExpr(operand)
  }

  const key = name.sourceString

  return unwrap(new Promise((resolve, reject) => {
    operand$.has(key)
      .then(has => {
        if (has) resolve(operand$.get(tile(key)))
        else reject('NOT DEFINED:: ' + key)
      })
  }))
}

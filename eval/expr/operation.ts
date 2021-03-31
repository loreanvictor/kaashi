import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { Tile, tile, unwrap } from '../tile'


export function evalOperation(left: Node, right: Node, context: EvalContext) {

  const lefttype = left.child(0).ctorName
  const key = left.child(0).sourceString
  const right$ = context.evalExpr(right)

  if (left.ctorName === 'Atomic' && lefttype === 'operator' || lefttype === 'variable') {
    return unwrap(new Promise<Tile>(resolve => {
      right$.has(key)
      .then(has => {
        if (has) {
          right$.get(tile(key)).then(resolve)
        } else {
          const left$ = context.evalExpr(left)
          right$.get(left$).then(resolve)
        }
      })
    }))
  } else {
    const left$= context.evalExpr(left)
    return unwrap(right$.get(left$))
  }
}

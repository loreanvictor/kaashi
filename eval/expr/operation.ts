import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { Tile, tile, unwrap } from '../tile'


export function evalOperation(left: Node, right: Node, keycheck: boolean, context: EvalContext) {
  const right$ = right.eval()(context)
  const key = left.sourceString

  if (keycheck) {
    return unwrap(new Promise<Tile>(resolve => {
      right$.has(key)
      .then(has => {
        if (has) {
          right$.get(tile(key)).then(resolve)
        } else {
          const left$ = left.eval()(context)
          right$.get(left$).then(resolve)
        }
      })
    }))
  } else {
    const left$ = left.eval()(context)
    return unwrap(right$.get(left$))
  }
}

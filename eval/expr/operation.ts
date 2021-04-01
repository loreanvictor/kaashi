import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { tile, unwrap } from '../tile'


export function evalOperation(left: Node, right: Node, keycheck: boolean, context: EvalContext) {
  const right$ = right.eval(context)
  const key = left.sourceString

  return unwrap((
    async () => {
      if (keycheck) {
        const has = await right$.has(key)
        if (has) {
          return await right$.get(tile(key))
        }
      }
      const left$ = left.eval(context)
      return await right$.get(left$)
    }
  )())
}

import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { SemanticError } from '../errors/semantic.error'
import { tile, unwrap } from '../tile'


export function evalOperation(left: Node, right: Node, keycheck: boolean, context: EvalContext, ref: Node) {
  const right$ = right.eval(context)
  const key = left.sourceString

  return unwrap((
    async () => {
      try {
        if (keycheck) {
          const has = await right$.has(key)
          if (has) {
            return await right$.get(tile(key))
          }
        }
        const left$ = left.eval(context)
        return await right$.get(left$)
      } catch (err) {
        if (!err.context) {
          throw new SemanticError(err, ref, context)
        } else {
          throw err
        }
      }
    }
  )())
}

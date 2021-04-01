import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { SemanticError } from '../errors/semantic.error'
import { Tile, unwrap } from '../tile'


export function evalIndex(operand: Node, indices: Node[], context: EvalContext, ref: Node): Tile<unknown> {
  const operand$ = operand.eval(context)

  return unwrap((
    async () => {
      try {
        return await operand$.get(
          ...indices.map(index => index.eval(context))
        )
      } catch (err) {
        if (!err.ref) {
          throw new SemanticError(err, ref)
        } else {
          throw err
        }
      }
    }
  )())
}

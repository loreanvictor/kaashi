import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { Tile, unwrap } from '../tile'


export function evalIndex(operand: Node, indices: Node[], context: EvalContext): Tile<unknown> {
  const operand$ = operand.eval(context)

  return unwrap(
    operand$.get(
      ...indices.map(index => index.eval(context))
    )
  )
}

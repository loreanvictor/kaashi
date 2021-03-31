import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { Tile, unwrap } from '../tile'


export function evalIndex(operand: Node, indices: Node[], context: EvalContext): Tile<unknown> {
  const operand$ = context.evalExpr(operand)

  return unwrap(
    operand$.get(
      ...indices.map(index => context.evalExpr(index))
    )
  )
}

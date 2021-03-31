import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { Tile } from '../tile'


export function evalExpr(node: Node, context: EvalContext): Tile<unknown> {
  return node.eval()(context)
}

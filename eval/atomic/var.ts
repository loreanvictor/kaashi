import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { unwrap } from '../tile'


export function evalVar(node: Node, context: EvalContext) {
  return unwrap(context.evalVar(node.sourceString, node))
}

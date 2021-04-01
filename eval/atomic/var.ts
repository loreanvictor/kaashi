import { Node } from 'ohm-js'
import { EvalContext } from '../context'


export function evalVar(node: Node, context: EvalContext) {
  return context.evalVar(node.sourceString, node)
}

import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { unwrap } from '../tile'


export function evalEnv(node: Node, context: EvalContext) {
  return unwrap(context.evalEnv(node.sourceString))
}

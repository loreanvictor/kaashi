import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { evalValue } from './value'


export async function evalAtomic(node: Node, context: EvalContext) {
  if (node.ctorName === 'Value') {
    return evalValue(node.child(0), context)
  } else if (node.ctorName === 'env') {
    return process.env[node.child(1).sourceString]
  } else {
    return context.evalVar(node.sourceString)
  }
}

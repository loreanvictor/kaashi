import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { tile } from '../tile'
import { evalValue } from './value'

// TODO: cleanup atomic parsing using semantic actions

export function evalAtomic(node: Node, context: EvalContext) {
  if (node.ctorName === 'Value') {
    return evalValue(node.unpack(), context)
  } else if (node.ctorName === 'env') {
    return tile(process.env[node.child(1).sourceString])
  } else {
    return context.evalVar(node.sourceString)
  }
}

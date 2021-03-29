import { Node } from 'ohm-js'
import { EvalContext } from '../context'


export function evalNumber(node: Node) {
  const src = node.sourceString.replace(/_/g, '')
  if (src.includes('.')) {
    return parseFloat(src)
  } else {
    return parseInt(src)
  }
}


export function evalBoolean(node: Node) {
  return node.sourceString === 'true'
}


export function evalString(node: Node, context: EvalContext) {
  if (node.ctorName === 'Template_string') {
    throw new Error('NOT IMPLEMENTED')
  } else {
    return node.sourceString
  }
}


export function evalValue(node: Node, context: EvalContext) {
  if (node.ctorName === 'number') {
    return evalNumber(node)
  } else if (node.ctorName === 'boolean') {
    return evalBoolean(node)
  } else {
    return evalString(node.child(0), context)
  }
}

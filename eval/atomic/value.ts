import { Node } from 'ohm-js'
import { EvalContext } from '../context'


export async function evalNumber(node: Node) {
  const src = node.sourceString.replace(/_/g, '')
  if (src.includes('.')) {
    return parseFloat(src)
  } else {
    return parseInt(src)
  }
}


export async function evalBoolean(node: Node) {
  return node.sourceString === 'true'
}


export async function evalString(node: Node, context: EvalContext) {
  if (node.ctorName === 'Template_string') {
    if (node.child(0).ctorName === 'bland_template') {
      return node.child(0).child(1).sourceString
    } else {
      const rules = node.child(0).children
      const bits = [
        rules[0].child(1).sourceString,
        context.evalExpr(rules[1].child(0))
      ]

      rules[2].children.forEach((rule, index) => {
        bits.push(rule.child(1).sourceString)
        bits.push(context.evalExpr(rules[3].child(index).child(0)))
      })

      bits.push(rules[4].child(1).sourceString)

      return Promise.all(bits).then(pieces => pieces.join(''))
    }
  } else {
    return node.child(1).sourceString
  }
}


export async function evalValue(node: Node, context: EvalContext) {
  if (node.ctorName === 'number') {
    return evalNumber(node)
  } else if (node.ctorName === 'boolean') {
    return evalBoolean(node)
  } else {
    return evalString(node.child(0), context)
  }
}

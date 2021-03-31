import { Node } from 'ohm-js'
import { evalAtomic } from '../atomic'
import { evalBlock } from './block'
import { EvalContext } from '../context'
import { Tile } from '../tile'
import { evalOperation } from './operation'
import { evalAttr } from './attr'


export function evalExpr(node: Node, context: EvalContext): Tile<unknown> {
  if (node.ctorName === 'Block') {

    const [_, rules, __, rule, ___] = node.children
    if (rule.numChildren === 0) {
      return evalBlock(rules.children, context)
    } else {
      return evalBlock([...rules.children, rule.child(0)], context)
    }

  } else if (node.ctorName === 'Atomic') {
    return evalAtomic(node.child(0), context)
  } else if (node.ctorName === 'Paranthesis') {
    return evalExpr(node.child(1).child(0), context)
  } else if (node.ctorName === 'Operation') {

    let [left, right] = node.children

    if (right.ctorName === 'Operand') {
      right = right.child(0)
    }

    return evalOperation(left.child(0), right, context)

  } else if (node.ctorName === 'Access') {
    if (node.child(0).ctorName === 'Attr') {
      const [operand, _, name] = node.child(0).children
      return evalAttr(operand, name, context)
    }
  }

  // TODO: resolve other nodes and stuff

  throw new Error('NOT IMPLEMENTED:: ' + node.ctorName + '(' + node.sourceString + ')')
}

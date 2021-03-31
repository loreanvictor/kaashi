import { Node } from 'ohm-js'
import { evalAtomic } from './atomic'
import { evalBlock } from './block'
import { EvalContext } from './context'
import { tile, Tile, unwrap } from './tile'


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
    let rightnode = node.child(1)

    if (rightnode.ctorName === 'Operand') {
      rightnode = rightnode.child(0)
    }

    const lefttype = node.child(0).child(0).child(0).ctorName
    const right = evalExpr(rightnode, context)
    const key = node.child(0).child(0).child(0).sourceString

    if (lefttype === 'operator' || lefttype === 'variable') {
      return unwrap(new Promise(resolve => {
        right.has(key)
        .then(has => {
          if (has) {
            right.get(tile(key)).then(resolve)
          } else {
            const left = evalExpr(node.child(0).child(0), context)
            right.get(left).then(resolve)
          }
        })
      }))
    } else {
      const left = evalExpr(node.child(0).child(0), context)
      return unwrap(right.get(left))
    }
  }

  // TODO: resolve other nodes and stuff

  throw new Error('NOT IMPLEMENTED:: ' + node.ctorName + '(' + node.sourceString + ')')
}

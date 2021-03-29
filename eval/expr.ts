import { Node } from 'ohm-js'
import { evalAtomic } from './atomic'
import { evalBlock } from './block'
import { EvalContext } from './context'


export async function evalExpr(node: Node, context: EvalContext) {
  if (node.ctorName === 'Block') {
    const [_, rules, __, rule, ___] = node.children
    if (rule.numChildren === 0) {
      return evalBlock(rules.children, context)
    } else {
      return evalBlock([...rules.children, rule.child(0)], context)
    }
  } else if (node.ctorName === 'Atomic') {
    return evalAtomic(node.child(0), context)
  }

  throw new Error('NOT IMPLEMENTED!')
}

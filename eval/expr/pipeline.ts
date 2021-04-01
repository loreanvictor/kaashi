import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { unwrap } from '../tile'


export function evalPipeline(left: Node, right: Node, context: EvalContext) {
  const right$ = right.eval()(context)
  const left$ = left.eval()(context)

  return unwrap(right$.get(left$))
}

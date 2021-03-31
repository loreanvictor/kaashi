import { Node } from 'ohm-js'
import { EvalContext, extend } from '../context'
import { Tile } from '../tile'


export function evalBlock(rules: Node[], context: EvalContext) {
  const res = new Tile()
  const ctx = extend(context, res)

  for (let rule of rules) {
    rule.blockRule()(res, ctx)
  }

  return res
}

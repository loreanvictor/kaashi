import { Node } from 'ohm-js'

export interface EvalContext {
  evalExpr(node: Node)
}
import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { Tile } from '../tile'


export function Key_rule(name: Node, _, expr: Node) {
  const { tile, context } = this.args

  const value = () => expr.eval(context)
  tile.set(name.sourceString, value)
}


export function Expr(_) {
  const { tile, context } = this.args
  tile.push(() => this.eval(context))
}

import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { Tile } from '../tile'


export function Key_rule(name: Node, _, expr: Node) {
  return (tile: Tile, context: EvalContext) => {
    const value = () => expr.eval()(context)
    tile.set(name.sourceString, value)
  }
}


export function Expr(_) {
  return (tile: Tile, context: EvalContext) => {
    tile.push(() => this.eval()(context))
  }
}

import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { Tile } from '../tile'


export function Key_rule(name: Node, def: Node, expr: Node) {
  return (tile: Tile, context: EvalContext) => {
    const value = () => expr.eval()(context)

    if (def.unpack().ctorName === 'override') {
      tile.set(name.sourceString, value)
    } else {
      throw new Error('NOT IMPLEMENTED YET:: extensions')
    }
  }
}


export function Expr(_) {
  return (tile: Tile, context: EvalContext) => {
    tile.push(() => this.eval()(context))
  }
}

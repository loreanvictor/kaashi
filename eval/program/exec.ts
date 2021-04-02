import { Node } from 'ohm-js'
import { extend } from '../context'
import { Tile } from '../tile'


export function Program(imports: Node, expr: Node) {
  if (imports.numChildren > 0) {
    const ctx = new Tile()
    imports.children.forEach(
      child => child.import(
        this.args.context,
        ctx,
        this.args.parse,
        this.args.loader,
        this.args.current
      )
    )

    return expr.eval(extend(this.args.context, ctx))
  } else {
    return expr.eval(this.args.context)
  }
}

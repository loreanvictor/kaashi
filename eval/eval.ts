import { Node } from 'ohm-js'

export * from './atomic/eval'
export * from './expr/eval'
export * from './block/eval'
export * from './pattern/eval'


export function Program(imports: Node, expr: Node) {
  // TODO: handle imports
  return expr.eval(this.args.context)
}

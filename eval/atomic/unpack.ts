import { Node } from 'ohm-js'


export function Template(start: Node, exprStart: Node, mid: Node, exprMid: Node, end: Node) {
  const strings = [
    start.child(1),
    ...mid.children.map(c => c.child(1)),
    end.child(1),
  ]

  const exprs = [exprStart, ...exprMid.children]

  return { strings, exprs }
}

export function single_quote_string(_, node: Node, __) { return node }
export function dbl_quote_string(_, node: Node, __) { return node }
export function bland_template(_, node: Node, __) { return node }
export function Atomic(node: Node) { return node }
export function Value(node: Node) { return node }
export function String(node: Node) { return node}
export function Template_string(node: Node) { return node }

export function env(_, node: Node) { return node }
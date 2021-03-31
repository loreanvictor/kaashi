import { Node } from 'ohm-js'

export function Operation(left: Node, right: Node) {
  const type = left.child(0).ctorName
  const deepType = left.child(0).child(0).ctorName

  return {
    left,
    right,
    keycheck: type === 'Atomic' && (deepType === 'operator' || deepType === 'variable')
  }
}

export function Index(operand: Node, _, indices: Node, __, index: Node, ___) {
  return {
    operand,
    indices: [...indices.children, index]
  }
}

export function Attr(operand: Node, _, name: Node) { return { operand, name } }
export function Paranthesis(_, node: Node, __) { return node }

export function Expr(node: Node) { return node }
export function Access(node: Node) { return node }
export function Operand(node: Node) { return node }
export function Index_operand(node: Node) { return node }

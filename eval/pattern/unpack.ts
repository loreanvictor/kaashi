import { Node } from 'ohm-js'


export function Pattern(_, matchings: Node, __, matching: Node, ___) {
  if (matching.numChildren === 1) {
    return { matchings: [...matchings.children, matching.child(0)] }
  } else {
    return { matchings: matchings.children }
  }
}

export function Matching(expr: Node, condition: Node) {
  return {
    expr,
    condition: condition.unpack()
  }
}

export function Condition(_, node: Node) {
  return node
}

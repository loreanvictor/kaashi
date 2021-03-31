import { Node } from 'ohm-js'


export function Block(_, rules: Node, __, rule: Node, ___) {
  if (rule.numChildren === 1) {
    return {
      rules: [...rules.children, rule.child(0)]
    }
  } else {
    return {
      rules: rules.children
    }
  }
}


export function Rule(node: Node) { return node }
export function def(node: Node) { return node }

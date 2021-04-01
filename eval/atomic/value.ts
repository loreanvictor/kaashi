import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { tile, unwrap } from '../tile'


export function evalNumber(node: Node) {
  const src = node.sourceString
  if (src.includes('.')) {
    return tile(parseFloat(src))
  } else {
    return tile(parseInt(src))
  }
}


export function evalBoolean(node: Node) {
  return tile(node.sourceString === 'true')
}


export function evalTemplate(strings: Node[], exprs: Node[], context: EvalContext) {
  const bits = []
  strings.forEach((str, index) => {
    bits.push(str.sourceString)
    if (index < strings.length - 1) {
      bits.push(exprs[index].eval(context).value())
    }
  })

  return unwrap(Promise.all(bits).then(pieces => tile(pieces.join(''))))
}


export function evalString(node: Node) {
  return tile(node.sourceString)
}

import { evalAttr } from './attr'
import { evalIndex } from './indexing'
import { evalOperation } from './operation'


export function Expr(_) {
  return this.unpack().eval()
}

export function Operation(_, __) {
  const { left, right, keycheck } = this.unpack()
  return context => evalOperation(left, right, keycheck, context)
}

export function Access(_) {
  return this.unpack().eval()
}

export function Attr(_, __, ___) {
  const {operand, name} = this.unpack()
  return context => evalAttr(operand, name, context)
}

export function Index(_, __, ___, ____, _____, ______) {
  const {operand, indices} = this.unpack()
  return context => evalIndex(operand, indices, context)
}

export function Operand(_) {
  return this.unpack().eval()
}

export function Index_operand(_) {
  return this.unpack().eval()
}

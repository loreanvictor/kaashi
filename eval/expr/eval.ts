import { evalAttr } from './attr'
import { evalIndex } from './indexing'
import { evalOperation } from './operation'
import { evalPipeline } from './pipeline'


export function Expr(_) {
  return this.unpack().eval()
}

export function Paranthesis(_, __, ___) {
  return this.unpack().eval()
}

export function Pipeline(_, __, ___) {
  const { left, right } = this.unpack()
  return context => evalPipeline(left, right, context)
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

export function Pipeline_operand(_) {
  return this.unpack().eval()
}

export function Operand(_) {
  return this.unpack().eval()
}

export function Index_operand(_) {
  return this.unpack().eval()
}

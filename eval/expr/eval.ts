import { evalAttr } from './attr'
import { evalIndex } from './indexing'
import { evalOperation } from './operation'
import { evalPipeline } from './pipeline'


export function Expr(_) {
  return this.unpacked.eval(this.args.context)
}

export function Paranthesis(_, __, ___) {
  return this.unpacked.eval(this.args.context)
}

export function Pipeline(_, __, ___) {
  const { left, right } = this.unpacked
  return evalPipeline(left, right, this.args.context)
}

export function Operation(_, __) {
  const { left, right, keycheck } = this.unpacked
  return evalOperation(left, right, keycheck, this.args.context)
}

export function Access(_) {
  return this.unpacked.eval(this.args.context)
}

export function Attr(_, __, ___) {
  const {operand, name} = this.unpacked
  return evalAttr(operand, name, this.args.context, this)
}

export function Index(_, __, ___, ____, _____, ______) {
  const {operand, indices} = this.unpacked
  return evalIndex(operand, indices, this.args.context, this)
}

export function Pipeline_operand(_) {
  return this.unpacked.eval(this.args.context)
}

export function Operand(_) {
  return this.unpacked.eval(this.args.context)
}

export function Index_operand(_) {
  return this.unpacked.eval(this.args.context)
}

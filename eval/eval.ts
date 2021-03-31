import { evalAtomic } from './atomic'
import { evalAttr } from './expr/attr'
import { evalBlock } from './expr/block'
import { evalIndex } from './expr/indexing'
import { evalOperation } from './expr/operation'


export function Expr(_) {
  return this.unpack().eval()
}

export function Block(_, __, ___, ____, _____) {
  const { rules } = this.unpack()
  return context => evalBlock(rules, context)
}

export function Atomic(_) {
  const core = this.unpack()
  return context => evalAtomic(core, context)
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

// TODO: resolve other nodes and stuff
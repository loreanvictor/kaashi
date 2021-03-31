import { evalEnv } from './env'
import { evalBoolean, evalNumber, evalString, evalTemplate } from './value'
import { evalVar } from './var'


export function number(_, __) {
  return () => evalNumber(this)
}

export function boolean(_) {
  return () => evalBoolean(this)
}

export function single_quote_string(_, __, ___) {
  const core = this.unpack()
  return () => evalString(core)
}

export function dbl_quote_string(_, __, ___) {
  const core = this.unpack()
  return () => evalString(core)
}

export function bland_template(_, __, ___) {
  const core = this.unpack()
  return () => evalString(core)
}

export function Template(_, __, ___, ____, _____) {
  const { strings, exprs } = this.unpack()
  return context => evalTemplate(strings, exprs, context)
}

export function Value(_) {
  return this.unpack().eval()
}

export function env(_, __) {
  const core = this.unpack()
  return () => evalEnv(core)
}

export function variable(_, __) {
  return context => evalVar(this, context)
}

export function operator(_) {
  return context => evalVar(this, context)
}

export function Atomic(_) {
  return this.unpack().eval()
}

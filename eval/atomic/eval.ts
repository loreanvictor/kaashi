import { evalEnv } from './env'
import { evalBoolean, evalNumber, evalString, evalTemplate } from './value'
import { evalVar } from './var'


export function number(_, __) {
  return evalNumber(this)
}

export function boolean(_) {
  return evalBoolean(this)
}

export function single_quote_string(_, __, ___) {
  return evalString(this.unpacked)
}

export function dbl_quote_string(_, __, ___) {
  return evalString(this.unpacked)
}

export function bland_template(_, __, ___) {
  return evalString(this.unpacked)
}

export function Template(_, __, ___, ____, _____) {
  const { strings, exprs } = this.unpacked
  return evalTemplate(strings, exprs, this.args.context)
}

export function Value(_) {
  return this.unpacked.eval(this.args.context)
}

export function env(_, __) {
  return evalEnv(this.unpacked)
}

export function variable(_, __) {
  return evalVar(this, this.args.context)
}

export function operator(_) {
  return evalVar(this, this.args.context)
}

export function Atomic(_) {
  return this.unpacked.eval(this.args.context)
}

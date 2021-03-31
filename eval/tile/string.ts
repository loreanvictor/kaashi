import { Rule, Tile } from './base'
import { BooleanTile } from './boolean'
import { NumberTile, NumericRule } from './number'
import { ruleset } from './ruleset'


export type StringOp = (a: string, b: string) => string
export type StringComp = (a: string, b: string) => boolean


export abstract class StringRule implements Rule {
  abstract value(...indices: Tile<unknown>[]): Promise<Tile<any>>
  async matches(...indices: Tile<unknown>[]) {
    if (indices.length > 1) {
      return false
    }

    const val = await indices[0].value()
    return typeof val === 'string'
  }
}


export class StringOpRule extends StringRule {
  constructor(readonly src: string, readonly op: StringOp) {
    super()
  }

  async value(...indices: Tile<unknown>[]){
    return new StringTile(this.op(await indices[0].value() as string, this.src))
  }
}


export class StringCompRule extends StringRule {
  constructor(readonly src: string, readonly op: StringComp) {
    super()
  }

  async value(...indices: Tile<unknown>[]){
    return new BooleanTile(this.op(await indices[0].value() as string, this.src))
  }
}


export class IndexRule extends NumericRule {
  constructor(readonly src: string) { super() }

  async value(...indices: Tile<unknown>[]) {
    return new StringTile(this.src[this.normalize(await indices[0].value() as number)])
  }

  normalize(index: number) {
    if (index < 0) {
      return this.src.length + index
    }
  }
}

export class StringTile extends Tile<string> {
  constructor(readonly val: string) {
    super()

    this.add(new IndexRule(val))
    this.set('length', () => new NumberTile(val.length))
    this.set('+', () => ruleset(new StringOpRule(val, (a, b) => a + b)))
    this.set('=', () => ruleset(new StringCompRule(val, (a, b) => a === b)))
    this.set('!=', () => ruleset(new StringCompRule(val, (a, b) => a !== b)))
  }

  async value() { return this.val }
}


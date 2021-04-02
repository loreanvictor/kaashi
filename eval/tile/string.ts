import { Rule, Tile, ruleset } from './base'
import { BooleanTile } from './boolean'
import { NumberTile } from './number'


export type StringOp = (a: string, b: string) => string
export type StringComp = (a: string, b: string) => boolean


export abstract class StringRule implements Rule {
  abstract value(...indices: Tile<unknown>[]): Promise<Tile<any>>
  async matches(index) {
    return !!index && typeof await index.value() === 'string'
  }
}


export class StringOpRule extends StringRule {
  constructor(readonly src: string, readonly op: StringOp) {
    super()
  }

  async value(index){
    return new StringTile(this.op(await index.value() as string, this.src))
  }
}


export class StringCompRule extends StringRule {
  constructor(readonly src: string, readonly op: StringComp) {
    super()
  }

  async value(index){
    return new BooleanTile(this.op(await index.value() as string, this.src))
  }
}


export class IndexRule {
  constructor(readonly src: string) { }

  async matches(index, end) {
    if (!index) {
      return false
    }

    const val = await index.value()
    return (
      typeof val === 'number'
      && (
        (val >= 0 && val < this.src.length)
        || (val < 0 && val >= -this.src.length)
      )
      && (!end || typeof await end.value() === 'number')
    )
  }

  async value(index, end) {
    if (end) {
      const s = this.normalize(await index.value())
      const e = this.normalize(await end.value())
      return new StringTile(this.src.substr(Math.min(s, e), Math.max(s, e)))
    } else {
      return new StringTile(this.src[this.normalize(await index.value())])
    }
  }

  normalize(index: number) {
    if (index < 0) {
      return this.src.length + index
    } else {
      return index
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


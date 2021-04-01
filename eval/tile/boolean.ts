import { Rule, Tile } from './base'
import { ruleset } from './ruleset'


export type BooleanOp = (a: boolean, b: boolean) => boolean


export class BooleanOpRule implements Rule {
  constructor(readonly src: boolean, readonly op: BooleanOp) {}

  async matches(...indices: Tile<unknown>[]) {
    if (indices.length < 1) {
      return false
    }

    const val = await indices[0].value()
    return typeof val === 'boolean'
  }

  async value(...indices: Tile<unknown>[]) {
    return new BooleanTile(this.op(await indices[0].value() as boolean, this.src))
  }
}


export class BooleanTile extends Tile<boolean> {
  constructor(readonly val: boolean) {
    super()
    this.set('not', () => new BooleanTile(!val))

    this.set('and', () => ruleset(new BooleanOpRule(val, (a, b) => a && b)))
    this.set('or', () => ruleset(new BooleanOpRule(val, (a, b) => a || b)))
    this.set('=', () => ruleset(new BooleanOpRule(val, (a, b) => a === b)))
    this.set('!=', () => ruleset(new BooleanOpRule(val, (a, b) => a !== b)))
  }

  async value() { return this.val }
}

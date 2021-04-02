import { Rule, Tile, ruleset } from './base'


export type BooleanOp = (a: boolean, b: boolean) => boolean


export class BooleanOpRule implements Rule {
  constructor(readonly src: boolean, readonly op: BooleanOp) {}

  async matches(index) {
    return !!index && typeof await index.value() === 'boolean'
  }

  async value(index) {
    return new BooleanTile(this.op(await index.value() as boolean, this.src))
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

import { Rule, Tile, ruleset } from './base'
import { BooleanTile } from './boolean'


export type NumericOp = (a: number, b: number) => number
export type NumericComp = (a: number, b: number) => boolean


export abstract class NumericRule implements Rule {
  abstract value(...indices: Tile<unknown>[]): Promise<Tile<any>>
  async matches(index) {
    return !!index && typeof await index.value() === 'number'
  }
}


export class NumericOpRule extends NumericRule {
  constructor(readonly src: number, readonly op: NumericOp) {
    super()
  }

  async value(index){
    return new NumberTile(this.op(await index.value() as number, this.src))
  }
}


export class NumericCompRule extends NumericRule {
  constructor(readonly src: number, readonly op: NumericComp) {
    super()
  }

  async value(...indices: Tile<unknown>[]){
    return new BooleanTile(this.op(await indices[0].value() as number, this.src))
  }
}


export class NumberTile extends Tile<number> {
  constructor(readonly val: number) {
    super()
    this.add(new NumericOpRule(val, (a, b) => a + b))

    this.set('+', () => new NumberTile(val))
    this.set('-', () => new NumberTile(-val))
    this.set('*', () => ruleset(new NumericOpRule(val, (a, b)=> a * b)))
    this.set('/', () => ruleset(new NumericOpRule(val, (a, b)=> a / b)))
    this.set('<', () => ruleset(new NumericCompRule(val, (a, b) => a < b)))
    this.set('<=', () => ruleset(new NumericCompRule(val, (a, b) => a <= b)))
    this.set('>', () => ruleset(new NumericCompRule(val, (a, b) => a > b)))
    this.set('>=', () => ruleset(new NumericCompRule(val, (a, b) => a >= b)))
    this.set('!=', () => ruleset(new NumericCompRule(val, (a, b) => a !== b)))
    this.set('=', () => ruleset(new NumericCompRule(val, (a, b) => a === b)))
  }

  async value() { return this.val }
}

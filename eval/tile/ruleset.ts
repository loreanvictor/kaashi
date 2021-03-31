import { Rule, Tile } from './base';


export class RuleSetTile extends Tile {
  constructor(readonly rules: Rule[]) {
    super()

    rules.forEach(rule => this.add(rule))
  }
}

export function ruleset(...rules: Rule[]) {
  return new RuleSetTile(rules)
}

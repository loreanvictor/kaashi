import { NoMatchingRule } from './errors/no-matching-rule.error'
import { NotPrimitive } from './errors/not-primitive.error'


export interface Rule<O=any> {
  matches(...indices: Tile<unknown>[]): Promise<boolean>
  value(...indices: Tile<unknown>[]): Promise<Tile<O>>
}

export class Tile<T=unknown> {
  static wrap: <U>(_: U) => Tile<U>
  static unwrap: <U>(_: Promise<Tile<U>>) => Tile<U>

  statics: any[] = []
  rules: Rule[] = []

  constructor() {
    this.set('in', () => ruleset({
      matches: async (index) => !!index,
      value: async (index) => {
        try {
          return Tile.wrap(await this.has(await index.value() as any))
        } catch(err) {
          return Tile.wrap(false)
        }
      }
    }))

    this.set('match', () => ruleset({
      matches: async (index) => !!index,
      value: async (index) => {
        for (let rule of this.rules) {
          if (await rule.matches(index)) {
            return Tile.wrap(true)
          }
        }

        return Tile.wrap(false)
      }
    }))

    this.set('or', () => ruleset({
      matches: async (index) => !!index,
      value: async () => this,
    }))
  }

  async has(key: string | number | boolean) {
    if ((key as any) in this.statics) {
      return true
    }

    if (typeof key === 'number') {
      const length = await this.length()
      return (key >= 0 && key < length) ||
            (key < 0 && key >= -length)
    }

    return false
  }

  set(key: string | number | boolean, value: () => Tile<unknown>) {
    if (key === 'length') {
      this.set('#length', value)
    } else {
      this.statics[key as any] = value
    }
  }

  push(value: () => Tile<unknown>) {
    this.statics.push(value)
    this.set('length', () => Tile.wrap(this.statics.length))
  }

  add(rule: Rule) {
    this.rules.unshift(rule)
  }

  async length() {
    if ('#length' in this.statics) {
      return await (this.statics['#length'] as any)().value()
    }

    return this.statics.length
  }

  _(...indices: any[]) {
    return Tile.unwrap(this.get(...indices.map(i => Tile.wrap(i))))
  }

  async get(...indices: Tile<unknown>[]): Promise<Tile<unknown> | undefined> {
    const keys = await Promise.all(indices.map(i => i.value()))
    if (
      keys.length === 1 &&
      (typeof keys[0] === 'boolean' || typeof keys[0] === 'number' || typeof keys[0] === 'string')
    ) {
      const key = keys[0]
      if (key === 'length' && '#length' in this.statics) {
        return (this.statics['#length'] as any)()
      } else if (Object.keys(this.statics).includes(key as any)) {
        return this.statics[key as any]()
      } else if (typeof key === 'number') {
        if (key in this.statics) {
          return this.statics[key]()
        } else {
          const length = await this.length() as number
          if (key < 0 && (length + key) in this.statics) {
            return this.statics[this.statics.length + key]()
          }
        }
      }
    }

    for (let rule of this.rules) {
      if(await rule.matches(...indices)) {
        return Tile.unwrap(rule.value(...indices))
      }
    }

    throw new NoMatchingRule(keys.map(key => `${key}`))
  }

  async value(): Promise<T> {
    throw new NotPrimitive(this)
  }
}

export class RuleSetTile extends Tile<unknown> {
  constructor(readonly rules: Rule[]) {
    super()
    rules.forEach(rule => this.add(rule))
  }
}

export function ruleset(...rules: Rule[]) {
  return new RuleSetTile(rules)
}

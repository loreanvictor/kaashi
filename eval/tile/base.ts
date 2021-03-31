export interface Rule<O=any> {
  matches(...indices: Tile<unknown>[]): Promise<boolean>
  value(...indices: Tile<unknown>[]): Promise<Tile<O>>
}

export class Tile<T=unknown> {
  static wrap: <U>(_: U) => Tile<U>

  statics: any[] = []
  rules: Rule[] = []

  async has(key: string | number | boolean) {
    return (key as any) in this.statics
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
  }

  add(rule: Rule) {
    this.rules.unshift(rule)
  }

  _(...indices: any[]) {
    return unwrap(this.get(...indices.map(i => Tile.wrap(i))))
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
      } else if ((key as any) in this.statics) {
        return this.statics[key as any]()
      } else if (typeof key === 'number' && key < 0 && (this.statics.length + key) in this.statics) {
        return this.statics[this.statics.length + key]()
      }
    }

    for (let rule of this.rules) {
      if(await rule.matches(...indices)) {
        return unwrap(rule.value(...indices))
      }
    }

    throw new Error('NOT DEFINED:: ' + keys)
  }

  async value(): Promise<T> {
    throw new Error('NOT PRIMITIVE')
  }
}


class UnwrappedTile<T> extends Tile<T> {
  constructor(readonly core: Promise<Tile<T>>) {
    super()
  }

  async get(...indices: Tile<unknown>[]) {
    return (await this.core).get(...indices)
  }

  async has(key: string | number | boolean) {
    return (await this.core).has(key)
  }

  async value(): Promise<T> {
    return (await this.core).value()
  }
}

export function unwrap<T=unknown>(t: Promise<Tile<T>>): Tile<T> {
  return new UnwrappedTile(t)
}

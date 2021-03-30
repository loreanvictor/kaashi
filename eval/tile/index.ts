export interface Rule<O=any> {
  matches(...indices: Tile<unknown>[]): Promise<boolean>
  value(...indices: Tile<unknown>[]): Promise<Tile<O>>
}

export class Tile<T=unknown> {
  statics: any[] = []
  rules: Rule[] = []

  async has(key: string | number | boolean) {
    return (key as any) in this.statics
  }

  set(key: string | number | boolean, value: () => Tile<unknown>) {
    this.statics[key as any] = value
  }

  push(value: () => Tile<unknown>) {
    this.statics.push(value)
  }

  add(rule: Rule) {
    this.rules.unshift(rule)
  }

  _(...indices: any[]) {
    return unwrap(this.get(...indices.map(i => tile(i))))
  }

  async get(...indices: Tile<unknown>[]): Promise<Tile<unknown> | undefined> {
    const keys = await Promise.all(indices.map(i => i.value()))
    if (
      keys.length === 1 &&
      (typeof keys[0] === 'boolean' || typeof keys[0] === 'number' || typeof keys[0] === 'string')
      && (keys[0] as any) in this.statics
    ) {
      return tile(this.statics[keys[0] as any]())
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

export class BooleanTile extends Tile<boolean> {
  constructor(readonly val: boolean) { super() }
  async value() { return this.val }
}

export class NumberTile extends Tile<number> {
  constructor(readonly val: number, op: (a: number, b: number) => number = (a, b) => a + b) {
    super()
    this.add({
      async matches(...indices: Tile<unknown>[]) {
        if (indices.length > 1) {
          return false
        }

        const val = await indices[0].value()
        return typeof val === 'number'
      },

      async value(...indices: Tile<unknown>[]) {
        return tile(op(await indices[0].value() as number, val))
      }
    })

    this.set('+', () => new NumberTile(val))
    this.set('-', () => new NumberTile(-val))
    this.set('*', () => new NumberTile(val, (a, b) => a * b))
    this.set('/', () => new NumberTile(val, (a, b) => a / b))
  }

  async value() { return this.val }
}


export class StringTile extends Tile<string> {
  constructor(readonly val: string) { super() }
  async value() { return this.val }
}


class UnwrappedTile<T> extends Tile<T> {
  constructor(readonly core: Promise<Tile<T>>) { super() }
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


export function tile(t: number): Tile<number>
export function tile(t: string): Tile<string>
export function tile(t: boolean): Tile<boolean>
export function tile<T>(t: Tile<T>): Tile<T>
export function tile<T>(t: number | string | boolean | Tile<T>) {
  if (typeof t === 'number') {
    return new NumberTile(t)
  } else if (typeof t === 'string') {
    return new StringTile(t)
  } else if (typeof t === 'boolean') {
    return new BooleanTile(t)
  }

  return t
}

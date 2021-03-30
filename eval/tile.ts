export interface Rule<I=any, O=any> {
  matches(index: Tile<I>): Promise<boolean>
  value(index: Tile<I>): Promise<Tile<O>>
}

export class Tile<T=Tile<never>> {
  statics: any[] = []
  rules: Rule[]

  async has(key: Tile<string> | Tile<number> | Tile<boolean>) {
    return (await key.value() as any) in this.statics
  }

  async set(key: Tile<string> | Tile<number> | Tile<boolean>, value: Tile<unknown>) {
    this.statics[(await key.value()) as any] = value
  }

  push(value: Tile<unknown>) {
    this.statics.push(value)
  }

  add(rule: Rule) {
    this.rules.unshift(rule)
  }

  _(index: any) {
    return unwrap(this.get(tile(index)))
  }

  async get(index: Tile<unknown>): Promise<Tile<unknown> | undefined> {
    const key = await index.value()
    if (
      (typeof key === 'boolean' || typeof key === 'number' || typeof key === 'string')
      && (key as any) in this.statics
    ) {
      return tile(this.statics[key as any])
    }

    for (let rule of this.rules) {
      if(await rule.matches(index)) {
        return tile(rule.value(index))
      }
    }

    return undefined
  }

  async value(): Promise<T> {
    return this as any
  }
}


export class NumberTile extends Tile<number> {
  constructor(readonly val: number) { super() }
  async value() { return this.val }
}


export class BooleanTile extends Tile<boolean> {
  constructor(readonly val: boolean) { super() }
  async value() { return this.val }
}


export class StringTile extends Tile<string> {
  constructor(readonly val: string) { super() }
  async value() { return this.val }
}


export class PromiseTile<T> extends Tile<T> {
  constructor(readonly promise: Promise<T>) { super() }
  async value() { return this.promise }
}

export function tile(t: number): Tile<number>
export function tile(t: string): Tile<string>
export function tile(t: boolean): Tile<boolean>
export function tile<T>(t: Promise<T>): Tile<T>
export function tile<T>(t: Tile<T>): Tile<T>
export function tile<T>(t: number | string | boolean | Promise<T> | Tile<T>) {
  if (typeof t === 'number') {
    return new NumberTile(t)
  } else if (typeof t === 'string') {
    return new StringTile(t)
  } else if (typeof t === 'boolean') {
    return new BooleanTile(t)
  } else if (t instanceof Promise) {
    return new PromiseTile(t)
  }

  return t
}

class UnwrappedTile<T> extends Tile<T> {
  constructor(readonly core: Promise<Tile<T>>) { super() }
  async get(index: Tile<unknown>) {
    return (await this.core).get(index)
  }
  async value() {
    return (await this.core).value()
  }
}

export function unwrap<T=unknown>(t: Promise<Tile<T>>) {
  return new UnwrappedTile(t)
}

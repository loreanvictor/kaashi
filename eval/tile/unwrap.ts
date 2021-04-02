import { Tile } from './base'


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

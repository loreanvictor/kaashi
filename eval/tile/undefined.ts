import { ruleset, Tile } from './base'


export class UndefinedTile extends Tile<undefined> {
  constructor() {
    super()

    this.set('or', () => ruleset({
      matches: async (index) => !!index,
      value: async (index) => index
    }))
  }

  async value() {
    return undefined
  }
}
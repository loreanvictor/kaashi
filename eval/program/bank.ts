import { Tile } from '../tile'


export type ParseFn = (code: string) => Tile<unknown>
export type LoadFn = (address: string) => Promise<string>


export class Bank {
  loaded: {[address: string]: Tile<unknown>} = {}

  async get(
    address: string,
    load: LoadFn,
    parse: ParseFn,
  ) {
    if (address in this.loaded) {
      return this.loaded[address]
    } else {
      return this.loaded[address] = parse(await load(address))
    }
  }

  static __instance: Bank

  static instance() {
    return this.__instance || (this.__instance = new Bank())
  }
}

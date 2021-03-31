import { Tile } from './base'
import { BooleanTile } from './boolean'
import { NumberTile } from './number'
import { StringTile } from './string'


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

Tile.wrap = tile

export { unwrap } from './base'
export { Tile, BooleanTile, NumberTile, StringTile }
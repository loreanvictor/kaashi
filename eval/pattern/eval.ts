import { tile } from '../tile'
import { evalPattern } from './pattern'


export function Pattern(_, __, ___, ____, _____) {
  const { matchings } = this.unpack()
  return context => evalPattern(matchings, context)
}

export function otherwise(_) {
  return () => tile(true)
}

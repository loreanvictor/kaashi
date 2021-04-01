import { tile } from '../tile'
import { evalPattern } from './pattern'


export function Pattern(_, __, ___, ____, _____) {
  const { matchings } = this.unpacked
  return evalPattern(matchings, this.args.context)
}

export function otherwise(_) {
  return tile(true)
}

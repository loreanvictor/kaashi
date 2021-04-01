import { evalBlock } from './block'


export function Block(_, __, ___, ____, _____) {
  const { rules } = this.unpacked
  return evalBlock(rules, this.args.context)
}

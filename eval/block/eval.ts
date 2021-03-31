import { evalBlock } from './block'


export function Block(_, __, ___, ____, _____) {
  const { rules } = this.unpack()
  return context => evalBlock(rules, context)
}

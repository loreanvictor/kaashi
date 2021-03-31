import { Node } from 'ohm-js'
import { tile } from '../tile'


export function evalEnv(node: Node) {
  return tile(process.env[node.sourceString])
}

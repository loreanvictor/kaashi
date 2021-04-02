import { Node } from 'ohm-js'


export function Import(node: Node) {
  return node
}

export function Alias_import(_, address: Node, alias: Node) {
  return { address, name: alias.unpacked }
}

export function Extract_import(
  _, address: Node,
  __, name: Node, alias: Node, 
  ___, names: Node, aliases: Node) {

  const _names = [name, ...names.children]
  const _aliases = [alias, ...aliases.children].map(n => n.child(0))

  return {
    address,
    names: _names.map((name, index) => ({ name, alias: _aliases[index].unpacked }))
  }
}

export function Alias(_, name: Node) {
  return name
}

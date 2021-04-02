import { Node } from 'ohm-js'
import { ErrorContext, SemanticError } from '../errors/semantic.error'
import { tile, unwrap } from '../tile'
import { Bank, LoadFn, ParseFn } from './bank'


function get(
  name: string,
  load: LoadFn,
  parse: ParseFn,
  context: ErrorContext,
  ref: Node,
) {
  return unwrap((
    async () => {
      try {
        return await Bank.instance().get(name, load, parse)
      } catch (err) {
        if (!err.context) {
          throw new SemanticError(err, ref, context)
        } else {
          throw err
        }
      }
    }
  )())
}

export function Import(_) {
  this.unpacked.import(
    this.args.context,
    this.args.tile,
    this.args.parse,
    this.args.loader,
    this.args.current
  )
}

export function Alias_import(_, __, ___) {
  const { address, name } = this.unpacked

  const addr = address.sourceString
  const [newaddr, content] = this.args.loader.load(addr, this.args.current)
  const parse = this.args.parse
  const context = this.args.context
  const ref = this

  const target = () => get(
    address.sourceString,
    content,
    code => parse(code, newaddr),
    context,
    ref,
  )

  this.args.tile.set(name.sourceString, target)
}

export function Extract_import(_, __, ___, ____, _____, ______, _______, ________) {
  const { address, names } = this.unpacked

  const addr = address.sourceString
  const [newaddr, content] = this.args.loader.load(addr, this.args.current)
  const parse = this.args.parse
  const context = this.args.context
  const ref = this

  const target = () => get(
    address.sourceString,
    content,
    code => parse(code, newaddr),
    context,
    ref
  )

  names.forEach(({name, alias}) => {
    let local = name.sourceString
    if (alias.numChildren > 0) {
      local = alias.sourceString
    }
    this.args.tile.set(local,
      () => unwrap((
        async () => {
          try {
            return await target().get(tile(name.sourceString))
          } catch (err) {
            if (!err.context) {
              throw new SemanticError(err, ref, context)
            } else {
              throw err
            }
          }
        }
      )())
    )
  })
}

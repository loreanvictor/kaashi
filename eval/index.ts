import { join } from 'path'
import { readFileSync } from 'fs'
import { grammar } from 'ohm-js'
import { empty, EvalContext } from './context'
import { Tile } from './tile'

import * as Unpack from './unpack'
import * as Eval from './eval'
import * as BlockRules from './block/rules'
import * as Exec from './program/exec'
import * as Import from './program/import'
import { Loader } from './program/loader'
import { SemanticError } from './errors/semantic.error'


const Grammar = grammar(readFileSync(join(__dirname, '..', 'grammar.ohm')).toString())
const Semantics = Grammar.createSemantics()
Semantics.addAttribute('unpacked', Unpack)
Semantics.addOperation('eval(context)', Eval)
Semantics.addOperation('blockRule(tile, context)', BlockRules)
Semantics.addOperation('exec(context, parse, loader, current)', Exec)
Semantics.addOperation('import(context, tile, parse, loader, current)', Import)


export function evaluate(
  code: string,
  address='',
  loader: Loader,
  context: EvalContext = empty(address || '?'),
): Tile<unknown> {
  const match = Grammar.match(code)

  if (match.succeeded()) {
    return Semantics(match).exec(
      context,
      (code, addr) => evaluate(code, addr, loader),
      loader,
      address,
    )
  } else {
    throw new SemanticError(
      match.shortMessage,
      match.message,
      context,
    )
  }
}

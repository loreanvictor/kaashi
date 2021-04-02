import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { UndefinedVariable } from '../errors/undefined-variable.error'
import { tile, Tile, unwrap } from '../tile'


export function evalAttr(operand: Node, name: Node, context: EvalContext, ref: Node): Tile<unknown> {
  const operand$ = operand.eval(context)

  const key = name.sourceString

  return unwrap((
    async () => {
      const has = await operand$.has(key)
      if (has) {
        return await operand$.get(tile(key))
      } else {
        throw new UndefinedVariable(key, ref, context)
      }
    }
  )())
}

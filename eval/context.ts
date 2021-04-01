import { Node } from 'ohm-js'
import { SemanticError } from './errors/semantic.error'
import { UndefinedVariable } from './errors/undefined-variable.error'
import { Tile, tile, unwrap } from './tile'


export interface EvalContext {
  evalVar(name: string, ref?: Node): Tile<unknown>
}

export function empty(): EvalContext {
  return {
    evalVar(name, ref?) {
      throw new UndefinedVariable(name, ref)
    }
  }
}

export function extend(context: EvalContext, child: Tile<unknown>): EvalContext {
  return {
    evalVar(name, ref?) {
      return unwrap((
        async () => {
          try {
            const has = await child.has(name)
            if (has) {
              return await child.get(tile(name))
            } else {
              return await context.evalVar(name, ref)
            }
          } catch (err) {
            if (!err.ref) {
              throw new SemanticError(err, ref)
            } else {
              throw err
            }
          }
        }
      )())
    }
  }
}

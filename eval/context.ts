import { Node } from 'ohm-js'
import { UndefinedVariable } from './errors/undefined-variable.error'
import { Tile, tile, unwrap } from './tile'


export interface EvalContext {
  evalVar(name: string, ref?: Node): Promise<Tile<unknown>>
}

export function empty(): EvalContext {
  return {
    async evalVar(name, ref?) {
      throw new UndefinedVariable(name, ref)
    }
  }
}

export function extend(context: EvalContext, child: Tile<unknown>): EvalContext {
  return {
    async evalVar(name, ref?) {
      const has = await child.has(name)
      if (has) {
        return await child.get(tile(name))
      } else {
        return await context.evalVar(name, ref)
      }
    }
  }
}

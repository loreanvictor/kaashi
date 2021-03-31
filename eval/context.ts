import { Tile, tile, unwrap } from './tile'


export interface EvalContext {
  evalVar(name: string): Tile<unknown>
}

export function empty(): EvalContext {
  return {
    evalVar(name) {
      throw new Error('Undefined:: ' + name)
    }
  }
}

export function extend(context: EvalContext, child: Tile<unknown>): EvalContext {
  return {
    evalVar(name) {
      return unwrap(
        new Promise(async resolve => {
          child.has(name).then(has => {
            if (has) {
              resolve(child.get(tile(name)))
            } else {
              resolve(context.evalVar(name))
            }
          })
        })
      )
    }
  }
}

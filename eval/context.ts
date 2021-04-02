import { Node } from 'ohm-js'
import { ErrorContext } from './errors/semantic.error'
import { UndefinedVariable } from './errors/undefined-variable.error'
import { Tile, tile, UndefinedTile } from './tile'


export interface EvalContext extends ErrorContext {
  evalVar(name: string, ref?: Node): Promise<Tile<unknown>>
  evalEnv(name: string): Promise<Tile<unknown>>
}

export function empty(name?: string): EvalContext {
  return {
    async evalVar(name, ref?) {
      throw new UndefinedVariable(name, ref, this)
    },

    async evalEnv() {
      return new UndefinedTile()
    },

    name() {
      return name || '<anon>'
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
    },

    async evalEnv(name) {
      return context.evalEnv(name)
    },

    name() {
      return context.name()
    }
  }
}

export function env(context: EvalContext, fetch: (name: string) => unknown | Promise<unknown>): EvalContext {
  return {
    async evalVar(name, ref) {
      return context.evalVar(name, ref)
    },

    async evalEnv(name) {
      return tile(await fetch(name) as any)
    },

    name() {
      return context.name()
    }
  }
}

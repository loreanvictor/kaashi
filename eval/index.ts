import { Grammar } from 'ohm-js'
import { evalAtomic } from './atomic'
import { evalBlock } from './block'
import { EvalContext } from './context'
import { evalExpr } from './expr'



export async function evaluate(grammar: Grammar, code: string) {
  return new Promise((resolve, reject) => {
    const match = grammar.match(code)
    if (match.succeeded()) {
      const semantics = grammar.createSemantics()
      const context: EvalContext = {
        evalExpr(node, context) {
          return evalExpr(node, context || this)
        },

        evalVar: () => undefined,
      }
  
      semantics.addOperation('walk', {
        Block(_, rules, __, rule, ___) {
          if (rule.numChildren === 1) {
            resolve(evalBlock([...rules.children, rule.child(0)], context))
          } else {
            resolve(evalBlock(rules.children, context))
          }
        },
  
        Atomic(rule) {
          resolve(evalAtomic(rule, context))
        }
      })
  
      semantics(match).walk()
    } else {
      reject(match.message)
    }
  })
}
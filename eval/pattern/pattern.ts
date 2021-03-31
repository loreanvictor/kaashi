import { Node } from 'ohm-js'
import { EvalContext } from '../context'
import { unwrap } from '../tile'


export function evalPattern(matchings: Node[], context: EvalContext) {
  return unwrap((
    async () => {
      for (let matching of matchings) {
        const { expr, condition } = matching.unpack()
        const value = await condition.eval()(context).value()
        if (value === true) {
          return expr.eval()(context)
        }
      }

      throw new Error('Nothing Matched!')
    }
  )())
}

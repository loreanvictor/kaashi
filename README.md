![banner](banner.svg)

# Kāshi
A turing complete JSON-like declarative language for data/config description.

## Why?

Really out of curiosity, to see what happens with such a language if it is designed in a convenient enough manner.
I suspect that this language will be useful for configuration management on large scale systems with pretty complex
configuration. We also suspect it might be useful in data-analysis. Originally, it was designed as a language for UI description,
though we later realized that all sorts of UI developers are already pretty comfortable with XML-based syntaxes and do
not cherish a JSON-like notation.

### Inspiring Examples

Factoriel function / dataset:

```kaashi
{
  !: {
    0: 1;
    [n]: n * (n - 1)!
  }
}
```
<br>
Fibbonacci sequence:

```kaashi
{
  fib[1]: 1;
  fib[2]: 1;
  fib[n | (n is number) and (n > 2)]: fib[n - 1] + fib[n - 2];
}
```

Alternative definition:

```kaashi
{
  fib[n | (n is number) and (n > 0)]: {
    1                         | n = 1;
    1                         | n = 2;
    fib[n - 1] + fib[n - 2]   | otherwise;
  }
}
```
<br>

Some array operations:

```kaashi
{
  /*
   * sum of all elements of an array
   */
  sum: {
    [{x, ...rest}]: x + sum[rest];                                // --> destructuring
    [{}]: 0;                                                      // --> so for empty array the value is zero
  };

  /*
   * mapping
   */
  map[F][l][i | (i is number) and (i < l.length)]: F[l[i], i];
  map[F][l]:: { length: l.length };                               // --> object extension

  /*
   * filtering
   */
  filter[F]: {
    [{x, ...rest}]: {
      { x, ...filter[F][rest] }  | x is F;                        // --> this is equivalent to `F[x]` or `x F` or `x --> F`
      filter[F][rest]            | otherwise;
    };

    [{}]: {};                                                     // --> empty array for empty array
  };

  /*
   * reduce function
   */
  reduce[F, I (default 0)]: {
    [{}]: I;
    [{x, ...rest}]: F[reduce[rest, I], x];
  };
}
```
<br>

A vector definition:

```kaashi
{
  sqrt: sqrt @from['https://some.server/math.kaashi'];
  { map: map, sum: sum }: @from['./array-operations.kaashi'];

  vec[N | N is number]
     [l | l.length = N]: {
    dimension: N;
    len: l --> map[[x]: x * x] --> sum --> sqrt;
    
    + [o | o.dimension = N]: l map[[x, i]: o[i] + x] vec[N];
    + :: this;

    - [o | o.dimension = N]: l map[[x, i]: o[i] - x] vec[N];
    - [i | i is number]: -l[i];
    - :: this;

    * [k | k is number]: l map[* k] --> vec[N];
    * [o | o.dimension = N]: l --> map[[x, i]: o[i] * x] sum;
    / [k | k is number]: this * (1 / k);
    ^ : l --> map[[x]: x / (len this)] --> vec[N];
  };

  vec[2][{x, y}]:: {x: x, y: y};
  vec[2][{x: x, y: y}]: vec[2][{x, y}];
}
```

<br>
And even crazier stuff:

```kaashi
{
  combinable: {
    o[F][x]: F[this[x]];
  }
}
```
```kaashi
{
  F[X]: X + 3; // --> or any arbitrary function
  G[X]: X * 2; // --> or any arbitrary function

  F::combinable @from['./combinable.kaashi'];
  G::combinable @from['./combinable.kaashi'];

  H: F o G;     // --> H[X]: (3 * x) + 2;
}
```

## State of the Project

This project is in _idea_ stage, i.e. the basic idea is documented (the [inspiring examples](#inspiring-examples) above). The syntax needs to be properly documented (I have started on that front, though it takes some time to get cozy with ABNF), the semantics need to be properly documented afterwards, etc, but I feel these examples do outline enough of the idea to be able to move forward.

So if you have time and interest in helping with this project, all kinds of help/input is much appreciated. The main work that needs to be done is as follows:

- **Syntax Specification**\
  Currently ABNF is picked as specification format, open to discussion)

- **Semantic Specification**\
  No format / methodology chosen, open to discussion

- **Reference Implementation**\
  A (not necessarily optimal) reference implementation would be greatly beneficial. Ideally this reference implementation should be written in JavaScript / TypeScript or in a manner compilable to WASM so that it allows easy implementation of a web-based playground.

- **Usable Implementation**\
  An implementation targeting a particular use case. What that use-case will be or in which environment / form the implementation will be (a standalone service/runtime, an integratable library targeting one or many specific languages, etc.) is open for discussion. The main aim of this particular endeavour is not necessarily to build a usable product out of the language but rather to further investigate necessary modifications / optimizations to syntax / semantics of Kāshi in a more realistic environment. Of course proper pursuit of that goal does entail somewhat trying to get a useful product out of it as well.

Since the project is in ideation stage, everything is open for discussion. Do not hesitate to open an issue for any form of question / feedback / etc. Also you can contact me on ghanizadeh.eugene@gmail.com.
  

![banner](banner.svg)

# Kāshi
A turing complete JSON-like declarative language for data/config description.

## Why?

Really out of curiosity, to see what happens with such a language if it is designed in a convenient enough manner.
We suspect that this language will be useful for configuration management on large scale systems with pretty complex
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

  H: F o G;     // --> H[X]: (3 * x) + 3;
}
```

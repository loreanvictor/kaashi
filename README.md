![banner](banner.svg)

# Kāshi
A turing complete JSON-like declarative language for data/config description.

## Why?

Out of curiosity. We suspect such a language might be useful in managing complex configuration or in data processing / analysis.
See [Design Goals](#design-goals) section below for more information on what we (currently) envision Kāshi to be.

### History

Originally, Kāshi was designed as a language for Android UI description
(as part of Inline-Apps platform of [CafeBazaar](https://github.com/cafebazaar)), though it was later swapped for a custom XML-based
format for that particular platform.

### Inspiring Examples

- Simple config:
```js
@from https://kaashi.dev/date import formatDate

{
  prod: true;
  root: $PWD + './dist';
  port: $PORT || 3000;
  middlewares: {
    '/users': { 'auth', 'admin' }, // arrays
    '/profile': { 'auth' }, 
  },

  //
  // also some function-like configuration values
  //
  logFormat: {
    warning: [msg, time]: 'WARNING: ' + msg;
    error: [msg, time]: `ERROR ({time formatDate['yy/MM/dd; hh:MM']}): {msg}`;
  };
}
```
<br>

- Data fetching / processing:
```js
@import https://kaashi.dev/csv as CSV
@from ./array-operations.ka import map, filter, sum

{
  mean[l]: sum[l] / l.length;

  //
  // import data
  //

  DATA: CSV['https://my.cluster.cloud/logs/cpu.csv'];
  NODES: CSV['https://my.clusetr.cloud/topology/nodes'];

  //
  // calculate stuff
  //
  overloadedNodes:
    NODES
    -> map[[node]: { node, DATA -> filter[[row]: row.id = node.id] -> mean }
    -> filter[[{node, mean}]: mean > $OVERLOAD_THRESHOLD]
    -> map[[{node}]: node]
  ;
}
```
<br>

More abstract examples to demonstrate syntactic capabilities:

- Factoriel function / dataset:

```js
{
  !: {
    0: 1;
    [n]: n * (n - 1)!
  }
}
```
<br>

- Fibbonacci sequence:

```js
{
  fib[n | (n is number) and (n > 0)]: {
    1                         | n = 1;
    1                         | n = 2;
    fib[n - 1] + fib[n - 2]   | otherwise;
  }
}
```
<br>

- Array operations:

```js
// array-operations.ka
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
  map: [F]: [l]: {
    length: l.length,
    [i | (i is number) and (i < l.length)]: F[l[i], i]
  }

  /*
   * filtering
   */
  filter: [F]: {
    [{x, ...rest}]: {
      { x, ...filter[F][rest] }  | x is F;                        // --> this is equivalent to `F[x]` or `x F` or `x --> F`
      filter[F][rest]            | otherwise;
    };

    [{}]: {};                                                     // --> empty array for empty array
  };

  /*
   * reduce function
   */
  reduce: [F, I (default 0)]: {
    [{}]: I;
    [{x, ...rest}]: F[reduce[F, I][rest], x];
  };
}
```
<br>

- Search/sort algorithms:
```js
{
  qsort: {                             // --> quick sort
    [{}]: {};                          // --> empty array is sorted
    [{x, ...rest}]: {
      ...(rest --> filter[[y]: y < x] -> qsort),
      x,
      ...(rest --> filter[[y]: y > x] -> qsort)
    }
  };

  merge: {                             // --> merges two sorted arrays, keeping them sorted
    [{a, ...ar}, {b, ...br}]: {
      { a, ...merge[ar, {b, ...br}] }  | a < b;
      { b, ...merge[{a, ...ar}, br] }  | otherwise;
    };
    [l, {}]: l;
    [{}, l]: l;
  };

  sort: {                              // --> merge sort
    [{}]: {};
    [{...left, ...right}]: merge[left sort, right sort];
  };

  contains: [x]: {                      // --> is `true` if given sorted list contains `x`, `false` otherwise
    [{}]: false;                       // --> empty list doesn't contain x
    [{...left, center, ...right}]: {   // --> basically, binary searching
      true              | x = center;
      left contains[x]  | x < center;
      right contains[x] | x > center;
    }
  };
}
```

<br>

- A geometric vector _type_:

```js
@from https://some.server/math import sqrt
@from ./array-operations.ka import map, sum

{
  vec:
    [N | N is number]:
    [l | l.length = N]: {
    dimension: N,
    len: l -> map[^ 2] -> sum -> sqrt,

    [o | o.dimension = N]: l map[[x, i]: o[i] + x] -> vec[N],
    +: l -> vec[N],
    -: l map[[x]: -x] -> vec[N],

    *: {
      [k | k is number]: l map[* k] -> vec[N],
      [o | o.dimension = N]: l -> map[[x, i]: o[i] * x] -> sum,
    },

    / [k | k is number]: l map[/ k] -> vec[N],
    ^ : l -> map[ / len] -> vec[N],
  };
}
```

<br><br>

## Design Goals

We want Kāshi to provide:
1. **Convenient Direct and Indirect Data Description** \
  At its core, Kāshi should be a more convenient format compared to JSON. Indirection allows for abstraction and reusability,
  which should make description of lots of intertwined and interdependent data more convenient, efficient and safe (e.g. complex
  configurations).

1. **Purity and Immutability** \
  This allows for option of full lazy evaluation and optimizations such as memoization. This also allows
  for seamless distribution of computation and parallelization. For example, Kāshi should be a language where map-reduce computations
  can be easily and intuitively described with seamless parallelization and node failure-recover (even on reduction) feasible.
  ```js
  {
    map[words][i]: { key: words[i], value: 1 };

    reduce[word, {count, ...rest}]: { key: word, sum: count + reduce[word, rest] };
    reduce[word, {}]: { key: word, sum: 0 };
  }
  ```
3. **Computational Limitability** \
  Kāshi's syntax should allow for syntactic checks that limit computational complexity of evaluating described data, without
  forcing unintuitive representation of computations within such a complexity bound. Most notably, it is highly desirable
  that _useful_ total functions have intuitive representations in Kāshi that can be syntactically proven to be total (ideally
  holding true for the most intuitive and simple representation of such functions). What _useful_ functions are depends on
  application domain. This property provides safety of utilizing Kāshi in contexts where full Turing-completeness is not needed
  or safety of execution is highly desirable.

<br><br>

## State of the Project

This project is in _idea_ stage, i.e. the basic idea is documented (the [inspiring examples](#inspiring-examples) above).
The syntax is [documented](grammar.ohm), and work on a simple evaluator has started.

So if you have time and interest in helping with this project, all kinds of help/input is much appreciated. The main work that needs to be done is as follows:

- [x] [~**Syntax Specification**~](grammar.ohm)

- [ ] **Semantic Specification**\
      No format / methodology chosen, open to discussion.

- [ ] **Reference Implementation**\
      _Work Started_
      A (not necessarily optimal) reference implementation would be greatly beneficial. Ideally this reference implementation should be written in JavaScript / TypeScript or in a manner compilable to WASM so that it allows easy implementation of a web-based playground.

- [ ] **Usable Implementation**\
      An implementation targeting a particular use case. What that use-case will be or in which environment / form the implementation will be (a standalone service/runtime, an integratable library targeting one or many specific languages, etc.) is open for discussion. The main aim of this particular endeavour is not necessarily to build a usable product out of the language but rather to further investigate necessary modifications / optimizations to syntax / semantics of Kāshi in a more realistic environment. Of course proper pursuit of that goal does entail somewhat trying to get a useful product out of it as well.

To run the current stuff, clone the repo and do the following:

1. Install dependencies:
  ```bash
  npm ci
  ```
2. Run the REPL:
  ```bash
  npm test
  ```
3. Or run the REPL with a given file:
  ```bash
  npm test samples-codes/fact.ka
  ```


Since the project is in ideation stage, everything is open for discussion. Do not hesitate to open an issue for any form of question / feedback / etc. Also you can contact me on ghanizadeh.eugene@gmail.com.


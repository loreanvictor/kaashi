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

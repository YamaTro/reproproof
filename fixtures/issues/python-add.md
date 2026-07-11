# `add` returns the wrong result for negative values

## Expected behavior

- `add(-1, 1)` returns `0`.

## Actual behavior

- `add(-1, 1)` returns `2`.

## Steps to reproduce

1. Import `add` from `calculator`.
2. Call `add(-1, 1)`.
3. Observe `2` instead of `0`.

## Environment

- Python 3.10 or later
- pytest

```python reproproof:path=tests/test_negative.py
from calculator import add


def test_preserves_negative_operands() -> None:
    assert add(-1, 1) == 0
```

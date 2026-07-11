def add(left: int, right: int) -> int:
    """Intentional fixture bug: negative values lose their signs."""
    return abs(left) + abs(right)

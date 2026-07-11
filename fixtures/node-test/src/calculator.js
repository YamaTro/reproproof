export function add(left, right) {
  // Intentional fixture bug: negative values lose their signs.
  return Math.abs(left) + Math.abs(right);
}

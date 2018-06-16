// Utility to split a number into significant and unsignificant digits
export function splitDigits(num: string, digits: number) {
  const asFixed = (+num).toFixed(digits);
  let significant = asFixed.replace(/0+$/g, '');
  let unsignificant = '0'.repeat(asFixed.length - significant.length);
  if (significant.endsWith('.')) {
    significant = significant.slice(0, -1);
    unsignificant = '.' + unsignificant;
  }

  return { significant, unsignificant }
}

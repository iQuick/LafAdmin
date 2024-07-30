export function random(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomCode = Math.floor(Math.random() * (122 - 48 + 1)) + 48;
    if (
      (randomCode >= 48 && randomCode <= 57) ||
      (randomCode >= 65 && randomCode <= 90) ||
      (randomCode >= 97 && randomCode <= 122)
    ) {
      result += String.fromCharCode(randomCode);
    } else {
      i--;
    }
  }
  return result;
}

export function isNull(obj) {
  return obj === null || obj === undefined;
}
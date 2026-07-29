export function isEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export function isRequired(value: string) {
  return value.trim().length > 0;
}

export function minLength(
  value: string,
  min: number
) {
  return value.length >= min;
}
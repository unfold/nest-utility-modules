export const stringToBoolean = (value: string | undefined) => {
  if (value === undefined) {
    return false
  }

  return !['false', '0', '', 'null', 'undefined'].includes(value.toLowerCase())
}

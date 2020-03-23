import { isString, isNumber, isBoolean } from 'lodash'

export const toStringValue = (value: any): string => {
  if (isString(value) || isNumber(value) || isBoolean(value)) {
    return value + ''
  }

  return JSON.stringify(value)
}

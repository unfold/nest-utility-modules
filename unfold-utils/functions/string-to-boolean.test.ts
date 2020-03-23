import { stringToBoolean } from './string-to-boolean'

describe('String to Boolean test', () => {
  it('should transform string to boolean ', () => {
    expect(stringToBoolean('')).toEqual(false)
    expect(stringToBoolean('false')).toEqual(false)
    expect(stringToBoolean('False')).toEqual(false)
    expect(stringToBoolean('FALSE')).toEqual(false)
    expect(stringToBoolean('0')).toEqual(false)
    expect(stringToBoolean('null')).toEqual(false)
    expect(stringToBoolean('Null')).toEqual(false)
    expect(stringToBoolean('NULL')).toEqual(false)
    expect(stringToBoolean('undefined')).toEqual(false)
    expect(stringToBoolean('UNDEFINED')).toEqual(false)

    expect(stringToBoolean('whatever')).toEqual(true)
    expect(stringToBoolean('1')).toEqual(true)
    expect(stringToBoolean('true')).toEqual(true)
    expect(stringToBoolean('True')).toEqual(true)

    expect(stringToBoolean(undefined)).toEqual(false)
  })
})

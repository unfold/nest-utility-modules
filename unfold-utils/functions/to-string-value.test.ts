import { toStringValue } from './to-string-value'

describe('toStringValue', () => {
  it('should leave string unchanged', () => {
    expect(toStringValue(' test ')).toBe(' test ')
  })

  it('should cast boolean to string', () => {
    expect(toStringValue(true)).toBe('true')
    expect(toStringValue(false)).toBe('false')
  })

  it('should cast boolean to string', () => {
    expect(toStringValue(true)).toBe('true')
    expect(toStringValue(false)).toBe('false')
  })

  it('show stringify array', () => {
    expect(toStringValue([1, 2, 3])).toBe('[1,2,3]')
  })

  it('show stringify object', () => {
    expect(toStringValue({ name: 'John', surname: 'Smith', age: 55, isAdmin: false })).toBe(
      '{"name":"John","surname":"Smith","age":55,"isAdmin":false}',
    )
  })
})

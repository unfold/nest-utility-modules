import { isUrl } from './isUrl'

describe('isUrl', () => {
  it('should validate url', () => {
    expect(isUrl('http://example.com/path/to/something?test1=1&test2=2')).toBe(true)
    expect(isUrl('//example.com/path/to/something?test1=1&test2=2')).toBe(false)
  })
})

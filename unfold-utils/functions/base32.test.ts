import { decodeBase32, encodeBase32 } from './base32'

describe('base32 test', () => {
  it('should decode string', async () => {
    expect(decodeBase32('edqput90edu74ubecwg78vt0chjp6vv4cm')).toBe('some string to decode')
  })

  it('should encode string', async () => {
    expect(encodeBase32('some string to encode')).toBe('edqput90edu74ubecwg78vt0cnq66vv4cm')
  })
})

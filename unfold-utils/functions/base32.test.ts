import { decodeBase32, encodeBase32 } from './base32'

describe('base32 test', () => {
  it('should decode string', async () => {
    expect(decodeBase32('edqput90edu74ubecwg78vt0chjp6vv4cm')).toBe('some string to decode')
    expect(decodeBase32('5n6n2mub851mcg9d85rnmvthc8v4uhjt')).toBe('-MQSKACFA-AqZo1b6MFY')
  })

  it('should encode string', async () => {
    expect(encodeBase32('some string to encode')).toBe('edqput90edu74ubecwg78vt0cnq66vv4cm')
    expect(encodeBase32('-MQSKACFA-AqZo1b6MFY')).toBe('5n6n2mub851mcg9d85rnmvthc8v4uhjt')
  })
})

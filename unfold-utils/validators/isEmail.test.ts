import { isEmail } from './isEmail'

describe('isEmail', () => {
  it('should validate email', () => {
    expect(isEmail('pawel@example.com')).toBe(true)
    expect(isEmail('pawel+test@example.com')).toBe(true)
    expect(isEmail('pawel+test[at]example.com')).toBe(false)
  })
})

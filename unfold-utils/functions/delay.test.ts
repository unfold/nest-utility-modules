jest.useFakeTimers()

describe('delay test', () => {
  it('should call setTimeout', async () => {
    const { delay } = require('./delay')

    delay(10000)

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000)
  })
})

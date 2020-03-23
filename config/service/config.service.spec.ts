jest.mock('fs', () => ({
  existsSync: () => true,
  readFileSync: () => `LOG_LEVEL=silly\nAPI_URL=https://api.url.com\n`,
}))

import { ConfigService } from './config.service'

describe('ConfigService test', () => {
  process.env.SOME_EXTRA_VAR_IN_PROCESS_ENV = 'VALUE'

  it('should load data', async () => {
    const config = new ConfigService({
      filePath: '/path/to/file.env',
      processConfigData: (loadedConfig) => ({
        ...loadedConfig,
        EXTRA_VARIABLE: 'EXTRA_VARIABLE_VALUE',
      }),
    })

    expect(config.has('LOG_LEVEL')).toBe(true)
    expect(config.has('API_URL')).toBe(true)
    expect(config.has('EXTRA_VARIABLE')).toBe(true)
    expect(config.has('SOME_EXTRA_VAR_IN_PROCESS_ENV')).toBe(true)

    expect(config.get('LOG_LEVEL')).toBe('silly')
    expect(config.get('API_URL')).toBe('https://api.url.com')
    expect(config.get('EXTRA_VARIABLE')).toBe('EXTRA_VARIABLE_VALUE')
    expect(config.get('SOME_EXTRA_VAR_IN_PROCESS_ENV')).toBe('VALUE')

    expect(config.has('SOME_NOT_EXISTING_VAR')).toBe(false)
    expect(config.get('SOME_NOT_EXISTING_VAR', { defaultValue: 'DEFAULT_VALUE' })).toBe('DEFAULT_VALUE')

    expect(() => config.get('SOME_NOT_EXISTING_VAR')).toThrowError(`Config variable 'SOME_NOT_EXISTING_VAR' does not exist`)
  })
})

import * as dotenv from 'dotenv'
import * as fs from 'fs'
import { isObject } from 'lodash'
import { Injectable } from '@nestjs/common'
import { ConfigDataInterface, ConfigModuleOptionsInterface } from '../types/interfaces'

@Injectable()
export class ConfigService {
  private readonly envConfig: ConfigDataInterface = {}
  private readonly fallbackToProcessEnv: boolean
  private readonly debug: boolean

  constructor(options: ConfigModuleOptionsInterface) {
    this.fallbackToProcessEnv = !options.noFallbackToProcessEnv
    this.debug = !!options.debug

    this.printDebug('[ConfigService] options:', options)
    this.printDebug('[ConfigService] process.env:', process.env)

    let loadedConfig: ConfigDataInterface = {}
    if (options.filePath && fs.existsSync(options.filePath)) {
      this.printDebug(`[ConfigService] loading file: '${options.filePath}'`)
      loadedConfig = dotenv.parse(fs.readFileSync(options.filePath))
      this.printDebug(`[ConfigService] Config loaded - file '${options.filePath}'`)
    } else {
      this.printDebug(`[ConfigService] Config file '${options.filePath}' not found`)
    }

    if (options.attachProcessEnvToLoadedConfig) {
      this.envConfig = {
        ...Object.keys(process.env).reduce((prev: ConfigDataInterface, key: string) => {
          if (process.env[key]) {
            prev = { ...prev, [key]: process.env[key] as string }
          }
          return prev
        }, {}),
        ...this.envConfig,
      }
    }
    this.envConfig = options.processConfigData ? options.processConfigData(loadedConfig) : loadedConfig
    this.printDebug('[ConfigService] Config data:', this.envConfig)
  }

  private printDebug(...messages: any[]) {
    if (this.debug) {
      // tslint:disable-next-line:no-console
      console.debug(...messages)
    }
  }

  get(key: string, options: { defaultValue?: string } = {}): string {
    if (this.envConfig[key]) {
      return this.envConfig[key]
    }

    if (this.fallbackToProcessEnv && process.env[key]) {
      return process.env[key] as string
    }

    if (isObject(options) && Object.keys(options).includes('defaultValue')) {
      return options.defaultValue as string
    }

    throw new Error(`Config variable '${key}' does not exist`)
  }

  has(key: string): boolean {
    try {
      this.get(key)

      return true
    } catch {
      return false
    }
  }

  hasAll(...keys: string[]): boolean {
    return keys.map((key) => this.has(key)).filter((result) => !result).length === 0
  }

  static isDevelopment(): boolean {
    return process.env.NODE_ENV !== 'production'
  }

  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
  }
}

export interface ConfigDataInterface {
  [key: string]: string
}

export interface ConfigModuleOptionsInterface {
  filePath?: string
  processConfigData?: (loadedConfig: ConfigDataInterface) => ConfigDataInterface
  noFallbackToProcessEnv?: boolean
  debug?: boolean
}

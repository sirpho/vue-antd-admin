/**
 * Generate additional configuration files when used for packaging. The file can be configured with some global variables, so that it can be changed directly externally without repackaging
 */
import { GLOB_CONFIG_FILE_NAME, OUTPUT_DIR } from '../constant'
import fs, { writeFileSync } from 'fs-extra'

import { getRootPath, getEnvConfig } from '../utils'
import { getConfigFileName } from '../getConfigFileName'

function createConfig(
  {
    configName,
    config,
    configFileName = GLOB_CONFIG_FILE_NAME
  }: { configName: string; config: any; configFileName?: string } = { configName: '', config: {} }
) {
  try {
    const windowConf = `window.${configName}`
    // Ensure that the variable will not be modified
    const configStr = `${windowConf}=${JSON.stringify(config)};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '')
    fs.mkdirp(getRootPath(OUTPUT_DIR))
    writeFileSync(getRootPath(`${OUTPUT_DIR}/${configFileName}`), configStr)

    console.log(`configuration file is build successfully:`)
    console.log(`${OUTPUT_DIR}/${configFileName}`)
  } catch (error) {
    console.log("configuration file configuration file failed to package:")
    console.log(error)
  }
}

export function runBuildConfig() {
  const config = getEnvConfig()
  const configFileName = getConfigFileName(config)
  createConfig({ config, configName: configFileName })
}

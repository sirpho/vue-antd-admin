// #!/usr/bin/env node

import { runBuildConfig } from './buildConf'
export const runBuild = async () => {
  try {
    const argvList = process.argv.splice(2)

    // Generate configuration file
    if (!argvList.includes('disabled-config')) {
      await runBuildConfig()
    }

    console.log(`build successfully!`)
  } catch (error) {
    console.log("vite build error:")
    console.log(error)
    process.exit(1)
  }
}
runBuild()

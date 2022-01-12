import autoImport from 'unplugin-auto-import/vite'

export function createAutoImport() {
  return autoImport({
    imports: [
      'vue',
      'vue-router',
      {
        'vuex': ['useStore']
      }
    ],
    dts: false
  })
}

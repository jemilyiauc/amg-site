import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 't6w8cnoy',
    dataset: 'production'
  },
  deployment: {
    autoUpdates: true,
  },
  typegen: {
    enabled: true,
    path: "../{app,components,sanity}/**/*.{ts,tsx}",
    schema: "schema.json",
    generates: "../sanity.types.ts",
    overloadClientMethods: true,
  },
})

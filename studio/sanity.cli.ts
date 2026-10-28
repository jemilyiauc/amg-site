import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 't6w8cnoy',
    dataset: 'production'
  },
  deployment: {
    appId: 'b7f6aq7l8r39kncn5alcaeuc',
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

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    auth_base_url: 'https://dev-sso.eurodata.de/u/auth',
    auth_realm: 'eurodata',
    auth_client_id: 'app-capitainio-fe',
    ATemailURL: 'google.com',
    ATemail: 'compacerautomatedtesting@gmail.com',
    ATemailName: 'compacerautomatedtesting',
    ATemailDomain: 'gmail.com',
    ATemailPass: 'automatedTesting1',
  },
  viewportWidth: 1600,
  viewportHeight: 900,
  chromeWebSecurity: false,
  pageLoadTimeout: 1000 * 60 * 2,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    specPattern: '**/specs/*.ts',
    baseUrl: 'https://capitain-io-demo.compacer.net/',
    experimentalSessionAndOrigin: true
  },
})

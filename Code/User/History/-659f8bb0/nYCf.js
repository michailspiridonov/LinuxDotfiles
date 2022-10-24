const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    auth_base_url: 'https://dev-sso.eurodata.de/u/auth',
    auth_realm: 'eurodata',
    auth_client_id: 'app-capitainio-fe',
    ATemailURL: 'https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&sacu=1&rip=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin',
    ATemail: 'compacerautomatedtesting@gmail.com',
    ATemailName: 'compacerautomatedtesting',
    ATemailDomain: 'gmail.com',
    ATemailPass: 'automatedTesting1',
  },
  viewportWidth: 1600,
  viewportHeight: 900,
  chromeWebSecurity: false,
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

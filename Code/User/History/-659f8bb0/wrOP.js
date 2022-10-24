const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    auth_base_url: 'https://dev-sso.eurodata.de/u/auth',
    auth_realm: 'eurodata',
    auth_client_id: 'app-capitainio-fe',
    ATemailURL: 'https://accounts.google.com/ServiceLogin?service=mail&passive=1209600&osid=1&continue=https://mail.google.com/mail/u/0/&followup=https://mail.google.com/mail/u/0/&emr=1',
    ATemail: 'compacerautomatedtesting@gmail.com',
    ATemailName: 'compacerautomatedtesting',
    ATemailDomain: 'gmail.com',
    ATemailPass: 'automatedTesting1',
    gmailAccount: {
      authorizationCode: '4/0AdQt8qioiBM9HhA5Mej01f0d2XtzY361w63fc6z3ZLsCXjzpZHNxQELfhMwlpAujqttJfg'
    }
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

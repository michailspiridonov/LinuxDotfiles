import { defineConfig } from 'cypress'
const { install, ensureBrowserFlags } = require('@neuralegion/cypress-har-generator')

export default defineConfig({
  screenshotsFolder: 'artifacts/screenshots',
  videosFolder: 'artifacts/videos',
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 35000,
  pageLoadTimeout: 120000,
  viewportWidth: 375,
  viewportHeight: 667,
  chromeWebSecurity: false,
  projectId: 'fucc3s',
  retries: 1,
  video: true,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents (on, config) {
      require('cypress-grep/src/plugin')(config)
      install(on, config)

      on('task', {
        log (message) {
          console.log(message)
          return null
        }
      })

      on('before:browser:launch', (browser = {}, launchOptions) => {
        ensureBrowserFlags(browser, launchOptions)
        return launchOptions
      })

      return config
    },
    specPattern: 'specs/**/*.ts',
    baseUrl: 'https://stage-nsf-local-cz.cz.drmax.net/',
    blockHosts: [
      '*meiro.drmax.cz'
    ]
  },
  env: {
    MAILOSAUR_API_KEY: 'eovxfyRSAdnQX3b',
    environment: 'cz_stage',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    data: {
      env: 'stage',
      country: 'cz',
      url: {
        graphql: 'https://stage-nsf-local-cz.cz.drmax.net/graphql',
        homepage: 'https://stage-nsf-local-cz.cz.drmax.net/',
        checkout: 'https://stage-nsf-local-cz.cz.drmax.net/pokladna/1',
        checkout_2_step: 'https://stage-nsf-local-cz.cz.drmax.net/pokladna/2',
        checkout_3_step: 'https://stage-nsf-local-cz.cz.drmax.net/pokladna/3',
        checkout_4_step: 'https://stage-nsf-local-cz.cz.drmax.net/pokladna/4',
        checkout_thankyou: 'https://stage-nsf-local-cz.cz.drmax.net/checkout/thankyou',
        admin: 'https://stage-magento2-local-cz.cz.drmax.net/admin_e6hddj/',
        rest_base: 'https://stage-magento2-local-cz.cz.drmax.net/rest/default/V1',
        pharmacies: 'https://stage-nsf-local-cz.cz.drmax.net/lekarny/',
        faq: 'https://stage-nsf-local-cz.cz.drmax.net/zeptejte-se-lekarnika/dotazy'
      },
      user: {
        login: 'tester.pjvurmhd@mailosaur.io',
        email: 'tester.pjvurmhd@mailosaur.io',
        pass: 'Testerpassword2021',
        name: 'Max',
        surname: 'Tester',
        birth_day: '11',
        birth_month: '11',
        birth_year: '2000',
        phone: '999888777',
        phone_prefix: '+420',
        street: 'Na poříčí',
        house_number: '1048',
        city: 'Praha 1',
        postcode: '11000',
        country_code: 'CZ',
        bussiness: {
          vat_id: 'CZ05051380',
          cin_id: '05051380',
          name: 'Tester a syn'
        }
      },
      admin: {
        login: 'automationTesting',
        pass: 'Computer2'
      },
      fulltext_pharmacy: 'Praha',
      default_shipping_method: 'drmaxshippingczechpost',
      default_payment_method: 'cashondelivery',
      store: '',
      website_view: 'Main Website',
      pharmacy_address: 'Pod Marjánkou 1906/12'
    }
  }
})

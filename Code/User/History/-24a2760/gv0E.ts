import { defineConfig } from 'cypress'

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
    baseUrl: 'https://nsf.drmax-cz.space/',
    blockHosts: [
      '*meiro.drmax.cz'
    ]
  },
  env: {
    MAILOSAUR_API_KEY: 'eovxfyRSAdnQX3b',
    environment: 'cz_upgrade_stage',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    data: {
      env: 'stage',
      country: 'cz',
      url: {
        graphql: 'https://nsf.drmax-cz.space/graphql',
        homepage: 'https://nsf.drmax-cz.space/',
        checkout: 'https://nsf.drmax-cz.space/pokladna/1',
        checkout_2_step: 'https://nsf.drmax-cz.space/pokladna/2',
        checkout_3_step: 'https://nsf.drmax-cz.space/pokladna/3',
        checkout_4_step: 'https://nsf.drmax-cz.space/pokladna/4',
        checkout_thankyou: 'https://nsf.drmax-cz.space/checkout/thankyou',
        admin: 'https://backend.drmax-cz.space/admin/admin/dashboard/',
        rest_base: 'https://backend.drmax-cz.space/rest/default/V1',
        pharmacies: 'https://nsf.drmax-cz.space/lekarny/',
        faq: 'https://nsf.drmax-cz.space/zeptejte-se-lekarnika/dotazy'
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

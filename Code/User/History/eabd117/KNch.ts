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
      on('task', {
        log (message) {
          console.log(message)
          return null
        }
      })
      return config
    },
    specPattern: 'specs/**/*.ts',
    baseUrl: 'https://www.drmax.cz/',
    blockHosts: [
      '*meiro.drmax.cz'
    ]
  },
  env: {
    MAILOSAUR_API_KEY: 'eovxfyRSAdnQX3b',
    environment: 'cz_prod',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    data: {
      env: 'prod',
      country: 'cz',
      url: {
        graphql: 'https://www.drmax.cz/graphql',
        homepage: 'https://www.drmax.cz/',
        admin: 'https://backend.drmax.cz/admin_tykMamzij7/',
        checkout: 'https://www.drmax.cz/pokladna/1',
        checkout_2_step: 'https://www.drmax.cz/pokladna/2',
        checkout_3_step: 'https://www.drmax.cz/pokladna/3',
        checkout_4_step: 'https://www.drmax.cz/pokladna/4',
        checkout_thankyou: 'https://www.drmax.cz/checkout/thankyou',
        pharmacies: 'https://www.drmax.cz/lekarny/',
        faq: 'https://www.drmax.cz/zeptejte-se-lekarnika/dotazy'
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
        city: 'Praha',
        postcode: '11000',
        bussiness: {
          id: '12348',
          cin_id: 'CZ12354654',
          vat_id: '09844023',
          name: 'Tester a syn'
        }
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

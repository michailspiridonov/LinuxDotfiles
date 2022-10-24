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
    baseUrl: 'https://nsf.platform.drmax.cloud/'
  },
  env: {
    MAILOSAUR_API_KEY: 'eovxfyRSAdnQX3b',
    environment: 'it_stage',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    data: {
      env: 'stage',
      country: 'it',
      url: {
        graphql: 'https://nsf.platform.drmax.cloud/graphql',
        homepage: 'https://nsf.platform.drmax.cloud/',
        checkout: 'https://nsf.platform.drmax.cloud/checkout/1',
        checkout_2_step: 'https://nsf.platform.drmax.cloud/checkout/2',
        checkout_3_step: 'https://nsf.platform.drmax.cloud/checkout/3',
        checkout_4_step: 'https://nsf.platform.drmax.cloud/checkout/4',
        checkout_thankyou: 'https://nsf.platform.drmax.cloud/checkout/grazie',
        admin: 'https://backend.platform.drmax.cloud/admin/admin',
        rest_base: 'https://backend.platform.drmax.cloud/rest/default/V1'
      },
      user: {
        login: 'fest.test-0002@test.com',
        email: 'fest.test-0002@test.com',
        pass: 'password-0002',
        name: 'John',
        surname: 'Tester',
        birth_day: '11',
        birth_month: '11',
        birth_year: '2000',
        phone: '999888777',
        phone_prefix: '+39',
        street: 'Via Larga',
        house_number: '10',
        city: 'Roma',
        postcode: '00186',
        country_code: 'IT',
        region: 'Agrigento',
        region_code: 'AG',
        bussiness: {
          cin_id: "12354654",
          name: "Tester a syn",
          vat_id: "IT12345678901"
        },
        regex_validation: {
          name: "[a-zA-Z]+ [a-zA-Z]+",
          email: "^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+(?:\\.[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$",
          phone: "Telefono \\(per poterti raggiungere in caso di problemi con il tuo ordine\\): .39 \\d{9,14}$",
          street_and_house: "^(.*[^-])\\s(\\d.*)$",
          city_and_postcode: "\\d+ [a-zA-Z]+"
        }
      },
      admin: {
        login: 'genericAdmin',
        pass: 'Computer2'
      },
      fulltext_pharmacy: 'rivoli',
      default_shipping_method: 'drmaxshippinggsped',
      default_payment_method: 'cashondelivery',
      store: '',
      website_view: 'Main Website'
    }
  }
})

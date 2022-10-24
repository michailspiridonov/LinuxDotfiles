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
    baseUrl: 'https://drmax-it.space/'
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
        graphql: 'https://drmax-it.space/graphql',
        homepage: 'https://drmax-it.space/',
        checkout: 'https://drmax-it.space/checkout/1',
        checkout_2_step: 'https://drmax-it.space/checkout/2',
        checkout_3_step: 'https://drmax-it.space/checkout/3',
        checkout_4_step: 'https://drmax-it.space/checkout/4',
        checkout_thankyou: 'https://drmax-it.space/checkout/grazie',
        agreements: 'https://drmax-it.space/agreements',
        admin: 'https://backend.drmax-it.space/admin_5u8rtJ38uh/admin',
        rest_base: 'https://backend.drmax-it.space/rest/default/V1'
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
          cin_id: '12354654',
          name: 'Tester a syn',
          vat_id: 'IT12345678901'
        },
        regex_validation: {
          name: '[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+ [A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+',
          email: '^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+(?:\\.[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$',
          phone: 'Telefono \\(per poterti raggiungere in caso di problemi con il tuo ordine\\): .39 ?\\d{9,14}$',
          street_and_house: '^(.*[^-])\\s(\\d.*)$',
          city_and_postcode: '\\d+ [A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+'
        }
      },
      admin: {
        login: 'genericAdmin',
        pass: 'Computer2'
      },
      fulltext_pharmacy: 'rivoli',
      default_shipping_method: 'drmaxshippinggsped',
      default_payment_method: 'cashondelivery',
      empty_cart_title: 'Il tuo carrello è vuoto',
      agreement_bitmap: {
        terms_conditions: true,
        heureka: false,
        personal_data: false,
        price_comparison: false
      },
      store: '',
      website_view: 'Main Website'
    }
  }
})

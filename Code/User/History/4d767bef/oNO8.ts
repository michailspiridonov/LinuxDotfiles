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
    baseUrl: 'https://www.drmaxdrogeria.pl/'
  },
  env: {
    MAILOSAUR_API_KEY: 'eovxfyRSAdnQX3b',
    environment: 'ed_prod',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    data: {
      env: 'prod',
      country: 'ed',
      url: {
        graphql: 'https://www.drmaxdrogeria.pl/graphql',
        homepage: 'https://www.drmaxdrogeria.pl/',
        checkout: 'https://www.drmaxdrogeria.pl/checkout/1',
        checkout_2_step: 'https://www.drmaxdrogeria.pl/checkout/2',
        checkout_3_step: 'https://www.drmaxdrogeria.pl/checkout/3',
        checkout_4_step: 'https://www.drmaxdrogeria.pl/checkout/4',
        checkout_thankyou: 'https://www.drmaxdrogeria.pl/checkout/dziekujemy',
        admin: 'https://backend.drmax.pl/admin_tiR9xoo5Fi'
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
        phone_prefix: '+48',
        street: 'Filtrowa',
        house_number: '1048',
        city: 'Warszawa',
        region: 'Warszawa',
        country_code: 'PL',
        postcode: '02-057',
        bussiness: {
          cin_id: '1231216692',
          name: 'Tester i syn',
          vat_id: '5562546356'
        },
        regex_validation: {
          name: '[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+ [A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+',
          email: '^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+(?:\\.[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$',
          phone: 'Telefon: .48 [1-9][0-9]{8}$',
          street_and_house: '^(.*[^-])\\s(\\d.*)$',
          city_and_postcode: '\\d+ [A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+'
        }
      },
      fulltext_pharmacy: 'Warszawa',
      default_shipping_method: 'drmaxshippingdpd',
      default_payment_method: 'cashondelivery',
      store: 'drogeria',
      website_view: 'Drogeria Website'
    }
  }
})

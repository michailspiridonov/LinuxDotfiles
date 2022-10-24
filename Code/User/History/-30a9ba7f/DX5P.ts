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
    baseUrl: 'https://www.sensiblu.com/'
  },
  env: {
    MAILOSAUR_API_KEY: 'eovxfyRSAdnQX3b',
    environment: 'ssb_prod',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    data: {
      env: 'prod',
      country: 'ssb',
      url: {
        graphql: 'https://www.sensiblu.com/graphql',
        homepage: 'https://www.sensiblu.com/',
        checkout: 'https://www.sensiblu.com/checkout/1',
        checkout_2_step: 'https://www.sensiblu.com/checkout/2',
        checkout_3_step: 'https://www.sensiblu.com/checkout/3',
        checkout_4_step: 'https://www.sensiblu.com/checkout/4',
        checkout_thankyou: 'https://www.sensiblu.com/checkout/dziekujemy',
        agreements: 'https://www.sensiblu.com/agreements',
        admin: 'https://backend.drmax.ro/admin_kawas4Shmy/admin/',
        pharmacies: 'https://www.sensiblu.com/farmacii'
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
        phone: '1999888777',
        phone_prefix: '+40',
        street: 'Calea Victoriei',
        house_number: '118',
        city: 'București',
        region: 'Bucureşti',
        region_code: 'B',
        country_code: 'RO',
        postcode: '010093',
        bussiness: {
          cin_id: '10640589',
          name: 'Tester și fiu',
          vat_id: 'J40/1234/2020'
        },
        regex_validation: {
          name: '[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+ [A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+',
          email: '^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+(?:\\.[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$',
          phone: 'Numar de telefon: .(43|32|359|385|357|420|45|372|358|33|49|30|36|354|353|39|371|423|370|352|356|31|47|48|351|40|421|386|34|46) ?[1-9][0-9]{8}$',
          street_and_house: '^(.*[^-])\\s(\\d.*)$',
          city_and_postcode: '\\d+ [A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+'
        }
      },
      fulltext_pharmacy: 'Alba',
      default_shipping_method: 'innoship',
      default_payment_method: 'cashondelivery',
      empty_cart_title: 'Cosul de cumparaturi este gol',
      agreement_bitmap: {
        terms_conditions: true,
        heureka: false,
        personal_data: false,
        price_comparison: false
      },
      store: 'ssb',
      website_view: 'Sensiblu Website',
      pharmacy_address: 'Comuna Bradu'
    }
  }
})

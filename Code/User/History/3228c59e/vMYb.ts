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
    baseUrl: 'https://stage-nsf-local-ro.ro.drmax.net/'
  },
  env: {
    MAILOSAUR_API_KEY: 'eovxfyRSAdnQX3b',
    environment: 'ro_stage',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    data: {
      env: 'stage',
      country: 'ro',
      url: {
        graphql: 'https://stage-nsf-local-ro.ro.drmax.net/graphql',
        homepage: 'https://stage-nsf-local-ro.ro.drmax.net/',
        checkout: 'https://stage-nsf-local-ro.ro.drmax.net/checkout/1',
        checkout_2_step: 'https://stage-nsf-local-ro.ro.drmax.net/checkout/2',
        checkout_3_step: 'https://stage-nsf-local-ro.ro.drmax.net/checkout/3',
        checkout_4_step: 'https://stage-nsf-local-ro.ro.drmax.net/checkout/4',
        checkout_thankyou: 'https://stage-nsf-local-ro.ro.drmax.net/checkout/thankyou',
        admin: 'https://stage-magento2-local-ro.ro.drmax.net/admin_VesoaksAv4/',
        rest_base: 'https://stage-magento2-local-ro.ro.drmax.net/rest/drmax/V1',
        pharmacies: 'https://stage-nsf-local-ro.ro.drmax.net/farmacii'
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
        phone: '0999888777',
        phone_prefix: '+40',
        street: 'Str. I. C. Bratianu',
        house_number: '1048',
        city: 'Budapesta',
        region: 'Alba',
        region_code: 'AB',
        country_code: 'RO',
        postcode: '717211',
        bussiness: {
          cin_id: 'J40/1234/2020',
          vat_id: '10640589',
          name: 'Tester ??i fiu'
        },
        regex_validation: {
          name: "[a-zA-Z]+ [a-zA-Z]+",
          email: "^[a-zA-Z0-9_!#$%&???*+/=?`{|}~^-]+(?:\\.[a-zA-Z0-9_!#$%&???*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$",
          phone: "Telefon: .+\\d{9,14}$",
          street_and_house: "^(.*[^-])\\s(\\d.*)$",
          city_and_postcode: "\\d+ [a-zA-Z]+"
        }
      },
      admin: {
        login: 'automationTesting',
        pass: 'Computer2'
      },
      fulltext_pharmacy: 'Alba',
      default_shipping_method: 'innoship',
      default_payment_method: 'cashondelivery',
      store: 'drmax',
      website_view: 'Main Website',
      pharmacy_address: 'Str. Bogdan Voda nr. 164-170'
    }
  }
})

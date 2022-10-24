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
    baseUrl: 'https://stage-nsf-local-pl-apteka.pl.drmax.net/'
  },
  env: {
    MAILOSAUR_API_KEY: 'eovxfyRSAdnQX3b',
    environment: 'ap_stage',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    data: {
      env: 'stage',
      country: 'ap',
      url: {
        homepage: 'https://stage-nsf-local-pl-apteka.pl.drmax.net/',
        admin: 'https://stage-magento2-local-pl.pl.drmax.net/admin_Jyu4Td7kvR/',
        rest_base: 'https://stage-magento2-local-pl.pl.drmax.net/rest/default/V1',
        graphql: 'https://stage-nsf-local-pl-drogeria.pl.drmax.net/graphql',
        checkout: 'https://stage-nsf-local-pl-apteka.pl.drmax.net/checkout/1',
        checkout_2_step: 'https://stage-nsf-local-pl-apteka.pl.drmax.net/checkout/2',
        checkout_3_step: 'https://stage-nsf-local-pl-apteka.pl.drmax.net/checkout/3',
        checkout_4_step: 'https://stage-nsf-local-pl-apteka.pl.drmax.net/checkout/4',
        checkout_thankyou: 'https://stage-nsf-local-pl-apteka.pl.drmax.net/checkout/dziekujemy',
        agreements: 'https://stage-nsf-local-pl-apteka.pl.drmax.net/agreements'
      },
      user: {
        login: 'stagePLUser02.pjvurmhd@mailosaur.io',
        email: 'stagePLUser02.pjvurmhd@mailosaur.io',
        pass: 'Fidorka0',
        name: 'Max',
        surname: 'Tester',
        birth_day: '11',
        birth_month: '11',
        birth_year: '2000',
        phone: '999888777',
        phone_prefix: '+48',
        street: 'Ulica Filtrowa',
        house_number: '1048',
        city: 'Warszawa',
        region: 'Warszawa',
        country_code: 'PL',
        postcode: '02-057',
        bussiness: {
          tax_id: '1231216692',
          name: 'Tester i syn',
          vat_id: '5562546356'
        },
        regex_validation: {
          name: '[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+ [A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+',
          email: '^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+(?:\\.[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$',
          phone: 'Telefon: .48 ?[1-9][0-9]{8}$',
          street_and_house: '^(.*[^-])\\s(\\d.*)$',
          city_and_postcode: '\\d+ [A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+'
        }
      },
      admin: {
        login: 'automationTesting',
        pass: 'Computer2'
      },
      fulltext_pharmacy: 'Warszawa',
      default_shipping_method: 'drmaxshippingdpd',
      default_payment_method: 'cashondelivery',
      empty_cart_title: 'Twój koszyk jest pusty',
      agreement_bitmap: {
        terms_conditions: false,
        heureka: false,
        personal_data: true,
        price_comparison: false
      },
      store: 'apteka',
      website_view: 'Apteka'
    }
  }
})

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
  video: false,
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
    baseUrl: 'https://stage-nsf-local-sk.sk.drmax.net/',
    blockHosts: [
      '*me.drmaxsk.meiro.io',
      '*meiro.drmax.cz'
    ]
  },
  env: {
    MAILOSAUR_API_KEY: 'eovxfyRSAdnQX3b',
    environment: 'sk_stage',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    data: {
      env: 'stage',
      country: 'sk',
      url: {
        graphql: 'https://stage-nsf-local-sk.sk.drmax.net/graphql',
        homepage: 'https://stage-nsf-local-sk.sk.drmax.net/',
        checkout: 'https://stage-nsf-local-sk.sk.drmax.net/pokladna/1',
        checkout_2_step: 'https://stage-nsf-local-sk.sk.drmax.net/pokladna/2',
        checkout_3_step: 'https://stage-nsf-local-sk.sk.drmax.net/pokladna/3',
        checkout_4_step: 'https://stage-nsf-local-sk.sk.drmax.net/pokladna/4',
        checkout_thankyou: 'https://stage-nsf-local-sk.sk.drmax.net/checkout/thankyou',
        admin: 'https://stage-magento2-local-sk.sk.drmax.net/admin_NAkqRKF87p/',
        rest_base: 'https://stage-magento2-local-sk.sk.drmax.net/rest/default/V1',
        pharmacies: 'https://stage-nsf-local-sk.sk.drmax.net/lekarne',
        faq: 'https://stage-nsf-local-sk.sk.drmax.net/spytajte-sa-lekarnika/otazky'
      },
      user: {
        login: 'tester.pjvurmhd@mailosaur.io',
        emai: 'tester.pjvurmhd@mailosaur.io',
        pass: 'Testerpassword2021',
        name: 'Max',
        surname: 'Tester',
        birth_day: '11',
        birth_month: '11',
        birth_year: '2000',
        phone: '999888777',
        phone_prefix: '+421',
        street: 'Štúrova ul.',
        house_number: '24/13',
        city: 'Bratislava',
        postcode: '81106',
        country_code: 'SK',
        region_code: 'AB',
        bussiness: {
          vat_id: 'SK1234567890',
          cin_id: '48115860',
          sk_dic: '2049555555',
          name: 'Tester a syn'
        }
      },
      admin: {
        login: 'automationTesting',
        pass: 'Computer2'
      },
      fulltext_pharmacy: 'Bratislava',
      default_shipping_method: 'drmaxskshippingupssk',
      default_payment_method: 'cashondelivery',
      postoffice_id: ['291284'],
      packeta_id: ['5163'],
      store: '',
      website_view: 'Main Website',
      pharmacy_address: 'Podhradská 580/1'
    }
  }
})

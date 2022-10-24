import { defineConfig } from 'cypress'

const baseUrl = 'https://stage-nsf-local-sk.sk.drmax.net'
const baseApiUrl = 'https://my-account-server.drmax-sk.space'
const magentoUrl = 'https://stage-magento2-local-sk.sk.drmax.net'

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
  retries: 0,
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
    baseUrl: 'https://stage-nsf-local-sk.sk.drmax.net/',
    blockHosts: [
      '*me.drmaxsk.meiro.io'
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
        graphql: `${baseUrl}/graphql`,
        homepage: `${baseUrl}/`,
        checkout: `${baseUrl}/pokladna/1`,
        checkout_2_step: `${baseUrl}/pokladna/2`,
        checkout_3_step: `${baseUrl}/pokladna/3`,
        checkout_4_step: `${baseUrl}/pokladna/4`,
        checkout_thankyou: `${baseUrl}/checkout/thankyou`,
        agreements: `${baseUrl}/agreements`,
        admin: `${magentoUrl}/admin_NAkqRKF87p/`,
        rest_base: `${magentoUrl}/rest/default/V1`,
        pharmacies: `${baseUrl}/lekarne`,
        faq: `${baseUrl}/spytajte-sa-lekarnika/otazky`,
        api: {
          login: `${baseApiUrl}/api/v2/login`,
          getClientMe: `${baseApiUrl}/api/v2/clients/me`
        }
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
        phone_prefix: '+421',
        street: 'Štúrova',
        house_number: '24/13',
        city: 'Bratislava',
        postcode: '81102',
        country_code: 'SK',
        region_code: 'AB',
        bussiness: {
          vat_id: 'SK1234567890',
          cin_id: '48115860',
          sk_dic: '2049555555',
          name: 'Tester a syn'
        },
        regex_validation: {
          name: '[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+ [A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+',
          email: '^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+(?:\\.[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$',
          phone: '.(43|32|359|385|357|420|45|372|358|33|49|30|36|354|353|39|371|423|370|352|356|31|47|48|351|40|421|386|34|46) ?[1-9][0-9]{8}$',
          street_and_house: '^(.*[^-])\\s(\\d.*)$',
          city_and_postcode: '\\d+ [A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+'
        }
      },
      admin: {
        login: 'automationTesting',
        pass: 'Computer2'
      },
      fulltext_pharmacy: 'Bratislava',
      default_shipping_method: 'drmaxskshippingupssk',
      default_payment_method: 'cashondelivery',
      empty_cart_title: 'Váš košík je prázdny',
      postoffice_id: ['291284'],
      packeta_id: ['5163'],
      agreement_bitmap: {
        terms_conditions: true,
        heureka: true,
        personal_data: false,
        price_comparison: false
      },
      store: '',
      website_view: 'Main Website',
      pharmacy_address: 'Obchodná 12, Bratislava'
    }
  }
})

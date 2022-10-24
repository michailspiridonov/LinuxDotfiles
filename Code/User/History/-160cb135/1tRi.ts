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
    baseUrl: 'https://www.drmax.sk/',
    blockHosts: [
      '*me.drmaxsk.meiro.io'
    ]
  },
  env: {
    MAILOSAUR_API_KEY: 'eovxfyRSAdnQX3b',
    environment: 'sk_prod',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    data: {
      env: 'prod',
      country: 'sk',
      url: {
        graphql: 'https://www.drmax.sk/graphql',
        homepage: 'https://www.drmax.sk/',
        checkout: 'https://www.drmax.sk/pokladna/1',
        checkout_2_step: 'https://www.drmax.sk/pokladna/2',
        checkout_3_step: 'https://www.drmax.sk/pokladna/3',
        checkout_4_step: 'https://www.drmax.sk/pokladna/4',
        checkout_thankyou: 'https://www.drmax.sk/pokladna/dziekujemy',
        agreements: 'https://www.drmax.sk/agreements',
        admin: 'https://backend.drmax.sk/admin_a1dwxg7dan/',
        pharmacies: 'https://www.drmax.sk/lekarne',
        faq: 'https://www.drmax.sk/spytajte-sa-lekarnika/otazky'
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
        street: 'Štúrova ul.',
        house_number: '24/13',
        city: 'Bratislava',
        postcode: '81106',
        bussiness: {
          vat_id: '48115860',
          cin_id: 'SK1234567890',
          sk_dic: '2049555555',
          name: 'Tester a syn'
        },
        regex_validation: {
          name: '[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+ [A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+',
          email: '^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+(?:\\.[a-zA-Z0-9_!#$%&’*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$',
          phone: 'Tel\\. číslo: .(43|32|359|385|357|420|45|372|358|33|49|30|36|354|353|39|371|423|370|352|356|31|47|48|351|40|421|386|34|46) ?[1-9][0-9]{8}$',
          street_and_house: '^(.*[^-])\\s(\\d.*)$',
          city_and_postcode: '\\d+ [A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+'
        }
      },
      fulltext_pharmacy: 'Bratislava',
      default_shipping_method: 'drmaxskshippingupssk',
      default_payment_method: 'cashondelivery',
      empty_cart_title: 'Váš košík je prázdny',
      agreement_bitmap: {
        terms_conditions: true,
        heureka: true,
        personal_data: false,
        price_comparison: false
      },
      store: '',
      website_view: 'Main Website',
      pharmacy_address: 'Podhradská 580/1'
    }
  }
})

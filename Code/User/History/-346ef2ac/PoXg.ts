export const GeneralLocators = {
  megamenu: {
    L1: {
      cmn: '.main-option__menu',
      cz: '.navigation__menu',
      ed: '.navigation__menu',
      ssb: '.navigation__menu'
    },
    L1_items: {
      cmn: '.main-option__menu > li',
      cz: '.navigation__menu > li',
      ed: '.navigation__menu > li',
      ssb: '.navigation__menu > li'
    },
    L2_items: {
      cmn: '[data-test-id="header-megamenu-item"]',
      cz: '#submenu-1 > li',
      ssb: '#submenu-1 > li',
    }
  },
  hamburger_menu: {
    locator: {
      cmn: '.header__middle > div >.header__hamburger',
      cz: '.header__hamburger'
    },
    navigate_eshop: {
      cmn: '.header-option__menu > #navigation-item-0',
      cz: '.navigation__menu > li:nth-child(1) > button',
      ssb: '.navigation__menu > li:nth-child(1) > button'
    },
    navigate_all_products: '.navigation__submenulvl2.show',
    navigate_L1_collapsable: '.navigation__submenulvl1.show'
  },
  footer: {
    links: {
      cmn: '#footer-links',
      cz: '.footer-links'
    },
    links_item: '.footer-links__item'
  },
  fulltext: {
    search_input: '[data-test-id="header-search-input"]',
    search_popup: '#header-search-results-popover',
    results: 'div.main-search',
    trigger_button: '.header-btns > .d-lg-none > svg',
    suggested_item: '.aa-suggestion',
    search_bar_category: {
      cmn: '#header-search-results-categories',
      ed: '.aa-suggestions'
    }
  },
  search_results: {
    product_name: '[data-test-id="category-tile-product-name"]'
  },
  login: {
    cmn: '.smart-menu [data-test-id="header-login-link-logged-out"]',
    cz: '.sso__header [data-test-id="header-login-link-logged-out"]',
    ssb: '.header-top [data-test-id$="header-login-link-logged-out"]',
    ap: '.header-top [data-test-id$="header-login-link-logged-out"]'
  },
  cart_modal: {
    locator: '#widget-lightbox',
    added_to_cart: {
      cmn: '[class="modal-title h1 font-weight-light"]',
      pl: '.modal-title.h1'
    },
    go_to_cart_button: '[data-test-id="product-cart-modal-go-to-cart-button"]'
  },
  cart_button_count: 'div.header-btns > div > button'
}

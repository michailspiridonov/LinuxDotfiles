export const GeneralLocators = {
  megamenu: {
    L1_items: {
      cmn: '.header-option__menu > li',
      cz: '.navigation__menu > li'
    },
    L2_items: {
      cmn: '.main-option__menu > li',
      cz: '#submenu-1 > li'
    }
  },
  hamburger_menu: {
    locator: '.header__middle > div >.header__hamburger',
    navigate_eshop: {
      cmn: '.header-option__menu > #navigation-item-0',
      cz: '.navigation__menu > #navigation-item-0'
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
  login: '.smart-menu [data-test-id="header-login-link-logged-out"]',
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

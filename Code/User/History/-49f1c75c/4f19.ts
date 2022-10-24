import {
  AdminRequestTemplates,
  CheckoutRequestTemplates,
  CmsPostsRequestTemplates,
  StockStatusRequestTemplates,
  CombineCondition,
  PaymentMethodCondition,
  SubtotalCondition,
  ProductFoundCondition,
  SKUCondition
} from './fixtures'

import {
  AdminConfigHandler,
  AdminCommonHandler,
  OrderDetailHandler,
  OrderEditHandler,
  ProductListHandler,
  SalesRuleHandler,
  BenefitPlusPaymentHandler,
  CategoryDetailHandler,
  CheckoutHandler,
  CommonHandler,
  EdenredPaymentHandler,
  PayUPaymentHandler,
  HomepageHandler,
  OrderStatusHandler,
  CSOBPaymentHandler,
  ProductHandler,
  SearchResultsHandler,
  UserHandler,
  AdminRequestHandler,
  CheckoutApiHandler,
  CmsPostsApiHandler,
  ElasticsearchApiHandler,
  StockStatusApiHandler,
  MinicartHandler
} from './handlers'

import {
  CartHelper,
  DateHelper,
  ExpectHelper,
  PavlovApiHelper,
  PavlovHelper,
  SalesRuleConditionHelper,
  ConditionKeyValue,
  ConditionCombine,
  ConditionSimple,
  ConditionAll,
  SalesRuleHelper,
  BrandESRequestBuilder,
  CategoryESRequestBuilder,
  ProductESRequestBuilder,
  ShippingMethodStorage,
  ShippingCodeShortcut,
  ExtendedShippingCode,
  ShippingMethodSelector,
  PaymentMethodStorage,
  PaymentCodeShortcut,
  ExtendedPaymentCode,
  PaymentMethodSelector,
  RandomEmailGenerator,
  RandomAddressGenerator,
  locate
} from './helpers'

import {
  AdminLocators,
  CategoryLocators,
  CheckoutLocators,
  CmsPostsLocators,
  CounselingLocators,
  HomepageLocators,
  MarketingBannersLocators,
  MarketingStandaloneActionsLocators,
  OrderDetailLocators,
  OrderEditLocators,
  OrderStatusLocators,
  PaginationLocators,
  PharmaciesLocators,
  ProductLocators,
  ProductEditLocators,
  SalesRulesLocators,
  SearchResultsLocators,
  UserLocators,
  RxReservationLocators,
  MinicartLocators
} from './locators'

import {
  WAIT_CONST,
  CONFIG_CONST
} from './support'

export {
  // Fixtures
  AdminRequestTemplates,
  CheckoutRequestTemplates,
  CmsPostsRequestTemplates,
  StockStatusRequestTemplates,
  CombineCondition,
  PaymentMethodCondition,
  SubtotalCondition,
  ProductFoundCondition,
  SKUCondition,
  // Handlers
  AdminConfigHandler,
  AdminCommonHandler,
  OrderDetailHandler,
  OrderEditHandler,
  ProductListHandler,
  SalesRuleHandler,
  BenefitPlusPaymentHandler,
  CategoryDetailHandler,
  CheckoutHandler,
  CommonHandler,
  EdenredPaymentHandler,
  PayUPaymentHandler,
  HomepageHandler,
  OrderStatusHandler,
  CSOBPaymentHandler,
  ProductHandler,
  SearchResultsHandler,
  UserHandler,
  MinicartHandler,
  // API Handlers
  AdminRequestHandler,
  CheckoutApiHandler,
  CmsPostsApiHandler,
  ElasticsearchApiHandler,
  StockStatusApiHandler,
  // Helpers
  CartHelper,
  DateHelper,
  ExpectHelper,
  PavlovApiHelper,
  PavlovHelper,
  SalesRuleConditionHelper,
  ConditionKeyValue,
  ConditionCombine,
  ConditionSimple,
  ConditionAll,
  BrandESRequestBuilder,
  CategoryESRequestBuilder,
  ProductESRequestBuilder,
  SalesRuleHelper,
  ShippingMethodStorage,
  ShippingCodeShortcut,
  ExtendedShippingCode,
  ShippingMethodSelector,
  PaymentMethodStorage,
  PaymentCodeShortcut,
  ExtendedPaymentCode,
  PaymentMethodSelector,
  RandomEmailGenerator,
  RandomAddressGenerator,
  locate,
  // Locators
  AdminLocators,
  CategoryLocators,
  CheckoutLocators,
  CmsPostsLocators,
  CounselingLocators,
  HomepageLocators,
  MarketingBannersLocators,
  MarketingStandaloneActionsLocators,
  OrderDetailLocators,
  OrderEditLocators,
  OrderStatusLocators,
  PaginationLocators,
  PharmaciesLocators,
  ProductLocators,
  ProductEditLocators,
  SearchResultsLocators,
  SalesRulesLocators,
  UserLocators,
  RxReservationLocators,
  MinicartLocators,
  WAIT_CONST,
  CONFIG_CONST
}

export const TAG = {
  SMOKE: 'smoke',
  EDGECASE: 'edgecase',
  E2E: 'e2e',
  PERFORMANCE: 'performance',
  CLEAN_UP: 'clean_up',
  CZ: 'cz',
  SK: 'sk',
  PL: 'pl',
  ED: 'ed',
  RO: 'ro',
  SSB: 'ssb',
  DEVCLOUD: 'dev_cloud'
}

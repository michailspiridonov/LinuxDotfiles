import {
  AdminRequestTemplates,
  CheckoutRequestTemplates,
  CmsPostsRequestTemplates,
  StockStatusRequestTemplates,
  CombineCondition,
  ProductSubselectCondition,
  PaymentMethodCondition,
  SubtotalCondition,
  ProductFoundCondition,
  SKUCondition
} from './fixtures'

import {
  AdminCommonHandler,
  IndexerHandler,
  SalesRuleHandler,
  CategoryDetailHandler,
  CheckoutHandler,
  CommonHandler,
  GeneralHandler,
  ProductHandler,
  UserHandler,
  MinicartHandler,
  ApiHandler,
  AgreementsApiHandler,
  AdminRequestHandler,
  CheckoutApiHandler,
  ElasticsearchApiHandler
} from './handlers'

import {
  DateHelper,
  AgreementsHelper,
  SalesRuleConditionHelper,
  ConditionKeyValue,
  ConditionCombine,
  ConditionSimple,
  ConditionAll,
  SalesRuleHelper,
  BrandESRequestBuilder,
  CategoryESRequestBuilder,
  ProductESRequestBuilder,
  MegamenuESRequestBuilder,
  ShippingMethodStorage,
  ShippingMethodSelector,
  PaymentMethodStorage,
  PaymentCodeShortcut,
  ExtendedPaymentCode,
  PaymentMethodSelector,
  RandomEmailGenerator,
  Range,
  locate,
  AbstractShippingMethod,
  BaseInputShippingMethod,
  BaseModalShippingMethod,
  NullableShippingMethod,
  SimpleShippingMethod
} from './helpers'

import {
  AdminLocators,
  IndexerLocators,
  CategoryLocators,
  CheckoutLocators,
  GeneralLocators,
  PharmaciesLocators,
  ProductLocators,
  SalesRulesLocators,
  UserLocators,
  MinicartLocators
} from './locators'

import {
  WAIT_CONST,
  CONFIG_CONST
} from './support/e2e'

import {
  accessToken
} from './support/commands'

export {
  // Fixtures
  AdminRequestTemplates,
  CheckoutRequestTemplates,
  CmsPostsRequestTemplates,
  StockStatusRequestTemplates,
  CombineCondition,
  ProductSubselectCondition,
  PaymentMethodCondition,
  SubtotalCondition,
  ProductFoundCondition,
  SKUCondition,
  // Handlers
  AdminCommonHandler,
  IndexerHandler,
  SalesRuleHandler,
  CategoryDetailHandler,
  CheckoutHandler,
  CommonHandler,
  GeneralHandler,
  ProductHandler,
  UserHandler,
  MinicartHandler,
  // API Handlers
  ApiHandler,
  AgreementsApiHandler,
  AdminRequestHandler,
  CheckoutApiHandler,
  ElasticsearchApiHandler,
  // Helpers
  DateHelper,
  AgreementsHelper,
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
  ShippingMethodSelector,
  PaymentMethodStorage,
  PaymentCodeShortcut,
  ExtendedPaymentCode,
  PaymentMethodSelector,
  RandomEmailGenerator,
  Range,
  locate,
  AbstractShippingMethod,
  BaseInputShippingMethod,
  BaseModalShippingMethod,
  NullableShippingMethod,
  SimpleShippingMethod,
  // Locators
  AdminLocators,
  IndexerLocators,
  CategoryLocators,
  CheckoutLocators,
  GeneralLocators,
  PharmaciesLocators,
  ProductLocators,
  SalesRulesLocators,
  UserLocators,
  MinicartLocators,
  // support
  accessToken,
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
  DEVCLOUD: 'dev_cloud',
  PROD_FRIENDLY: 'prod_friendly',
  P1: 'priority_1',
  P2: 'priority_2',
  P3: 'priority_3',
  P4: 'priority_4',
  DESKTOP: 'desktop'
}

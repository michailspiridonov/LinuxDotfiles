import { CONFIG_CONST } from 'cypress/index_'
import { ElasticSearchRequestBuilder } from './elastic_search_request_builder'

export class MegamenuESRequestBuilder extends ElasticSearchRequestBuilder {
  public constructor () {
    super('megamenu')
  }

  public build (): string {
    const index = (['it'].includes(CONFIG_CONST.COUNTRY) || (Cypress.env('environment') === 'cz_upgrade_stage')) ? 'drmax_frontend_megamenu_1' : 'drmax_eshop_1'
    const type = (['it'].includes(CONFIG_CONST.COUNTRY) || (Cypress.env('environment') === 'cz_upgrade_stage')) ? '' : '&type=mega_menu'
    const ESUrl = CONFIG_CONST.HOMEPAGE_URL +
      `_e?index=${index}&body={
                  "size":10,
                  "_source": [],
                  "from":0,
                  "sort":[],
                  "aggs":{}
                }${type}`
    return ESUrl
  }
}

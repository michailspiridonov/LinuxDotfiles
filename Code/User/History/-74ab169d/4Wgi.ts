import { ElasticSearchRequestBuilder } from './elastic_search_request_builder'

export class MegamenuESRequestBuilder extends ElasticSearchRequestBuilder {
  public constructor () {
    super('megamenu')
  }

  public build (): string {
    const index = (['it'].includes(CONFIG_CONST.COUNTRY) || (Cypress.env('environment') === 'cz_upgrade_stage')) ? 'drmax_frontend_megamenu_1' : 'drmax_eshop_1'
    const type = (['it'].includes(CONFIG_CONST.COUNTRY) || (Cypress.env('environment') === 'cz_upgrade_stage')) ? '' : '&type=mega_menu'
    const ESUrl = `/_e?index=${index}&body={
                  "_source":[],
                  "size":10,
                  "from":0,
                  "sort":[],
                  "aggs":{}
                }${type}`
    return ESUrl
  }
}

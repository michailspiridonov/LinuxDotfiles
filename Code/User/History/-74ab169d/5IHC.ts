import { ElasticSearchRequestBuilder } from './elastic_search_request_builder'

export class MegamenuESRequestBuilder extends ElasticSearchRequestBuilder {
  public constructor () {
    super('megamenu')
  }

  public build (): string {
    const _source = this.sourcesToString(this.sources)
    const mustTerms = this.termsToString(this.terms.filter(term => term.must).map(term => this.termToString(term)))
    const mustNotTerms = this.termsToString(this.terms.filter(term => !term.must).map(term => this.termToString(term)))
    const elasticPrefix = (['it'].includes(CONFIG_CONST.COUNTRY) || (Cypress.env('environment') === 'cz_upgrade_stage')) ? `_e?index=drmax_frontend_${this.type}_1&body=` : `_e?type=${this.type}&body=`
    return CONFIG_CONST.HOMEPAGE_URL + elasticPrefix + `{
        "size":${this.size},
        "from":0,
        "query":{
          "bool":{
            "must": ${mustTerms},
            "must_not": ${mustNotTerms}
          }
        },
        "_source": ${_source},
        "sort" : [
          "_score"
        ],
        "aggs":{}
      }`
  }
}

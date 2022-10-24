import { CONFIG_CONST } from 'cypress/index_'

export type Range = { lte?: number, gte: number }
export type SimpleTerm = { key: string, must: boolean, value: number | string | boolean }
export type ArrayTerm = { key: string, must: boolean, value: string[] }
export type RangeTerm = { key: string, must: boolean, value: Range }
export type ExistsTerm = { key: string, must: boolean }
export type Term = SimpleTerm | ArrayTerm | RangeTerm

export abstract class ElasticSearchRequestBuilder {
  private type: string
  private size: number
  private terms: Term[]
  private sources: string[]

  public constructor (type: string) {
    this.type = type
    this.size = 10
    this.terms = []
    this.sources = []
  }

  private termToString (term: Term) {
    if (term.value === 'exists_query') {
      return `{
          "exists":{
            "field": ${JSON.stringify(term.key)}
          }
        }`
    } else if (Array.isArray(term.value)) {
      return this.arrayToString(<ArrayTerm>term)
    } else if ((<RangeTerm>term).value.gte !== undefined) {
      return this.rangeToString(<RangeTerm>term)
    } else {
      if (['it'].includes(CONFIG_CONST.COUNTRY)) {
        return `{
          "match": {
            "${term.key}": { "query": ${JSON.stringify(term.value)} }
          }
        }`
      } else {
        return `{
            "term": {
              "${term.key}": ${JSON.stringify(term.value)}
            }
          }`
      }
    }
  }

  private arrayToString (term: ArrayTerm) {
    return `{
              "terms":{
                  "${term.key}": ${JSON.stringify(term.value)}
              }
          }`
  }

  private rangeToString (term: RangeTerm) {
    return `{
              "range":{
                "${term.key}": {
                  "gte": ${term.value.gte}
                  ${term.value.lte !== undefined
                  ? `,"lte": ${term.value.lte}`
                  : ''
              }
                }
              }
            }`
  }

  private termsToString (array: string[]) {
    return '[' + array.join(',') + ']'
  }

  private sourcesToString (array: string[]) {
    return '[' + array.map((val) => { return `"${val}"` }).join(',') + ']'
  }

  public setSize (size: number): ElasticSearchRequestBuilder {
    this.size = size
    return this
  }

  public addTerm (term: Term): ElasticSearchRequestBuilder {
    this.terms.push(term)
    return this
  }

  public addExistsTerm (term: ExistsTerm): ElasticSearchRequestBuilder {
    this.terms.push({ key: term.key, must: term.must, value: 'exists_query' })
    return this
  }

  public addSource (source: string): ElasticSearchRequestBuilder {
    this.sources.push(source)
    return this
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

import { CONFIG_CONST } from 'cypress/index_'

export type ProductEsDto = {
  count: number
  _source: string[]
  pimStatuses: string[]
  otc?: boolean
  finalPrice?: { lte?: number; gte?: number }
  drmaxStockSalableQty?: { lte?: number; gte?: number }
  stock?: { lte?: number; gte?: number }
  reservation?: boolean
}

export type CategoryEsDto = {
  count: number
  _source: string[]
  minimalNumberOfProductsInCategory?: { lte?: number; gte?: number }
  termKey: string
  termValue: string
}

export type BrandEsDto = {
  count: number
  _source: string[]
  termKey: string
  termValue: string
}

export type MegamenuCategoryDto = {
  id: string,
  parent_id: number,
  title: string,
  link_type: string,
  image: string,
  value: string,
  css_class?: string,
  footer_image?: string,
  footer_title?: string,
  footer_text?: string,
  footer_tag?: string,
  footer_link_type?: string,
  footer_link_value?: string,
  items: MegamenuCategoryDto[],
  entity_id: number,
  url_key: string,
  url_path: string,
  slug: string,
  link: string
}

export class ElasticsearchRequestTemplates {
  static arrayToString (array: string[]): string {
    return array
      .map((val) => {
        return `"${val}"`
      })
      .reduce((prev, curr) => {
        return prev + ',' + curr
      })
  }

  static getRangeFilter (name: string, term?: { lte?: number; gte?: number }): string {
    return term !== undefined
      ? `,{
    "range":{
      "${name}": {
        "gte": "${term.gte !== undefined ? term.gte : 0}"
        ${term.lte !== undefined ? `,"lte": "${term.lte}"` : ''}
      }
    }
  }`
      : ''
  }

  static getProductsUrl (dto: ProductEsDto): string {
    const pimStatuses: string = this.arrayToString(dto.pimStatuses)
    const _source: string = this.arrayToString(dto._source)
    return (
      CONFIG_CONST.HOMEPAGE_URL + '_e?type=product&body=' +
      `{
        "size":${dto.count},
        "from":0,
        "query":{
          "bool":{
            "must":[
              {
                "terms":{
                  "drmax_pim_status":[${pimStatuses}]
                }
              }
              ${
                (['ro', 'ssb'].includes(CONFIG_CONST.COUNTRY)) && dto.otc !== undefined
                  ? `,{
                "terms":{
                  "drmax_otc":[${Number(dto.otc)}]
                }
              }`
                  : ''
              }
              ${
                ['sk'].includes(CONFIG_CONST.COUNTRY) && dto.reservation !== undefined
                  ? `,{
                "terms":{
                  "adv_price_is_reservation_allowed":[${Number(dto.reservation)}]
                }
              }`
                  : ''
              }
              ${this.getRangeFilter('final_price', dto.finalPrice)}
              ${this.getRangeFilter('drmax_stock_salable_qty', dto.drmaxStockSalableQty)}
              ${this.getRangeFilter('stock.qty', dto.stock)}
            ]
          }
        },
        "_source": [${_source}],
        "sort" : [
          { "drmax_stock_salable_qty" : "desc" },
          "_score"
        ],
        "aggs":{}
      }`
    )
  }

  static getCategoryDataTemplate (dto: CategoryEsDto): string {
    const _source: string = this.arrayToString(dto._source)
    return (
      CONFIG_CONST.HOMEPAGE_URL + '_e?type=category&body=' +
      `{
        "size":${dto.count},
        "from":0,
        "query":{
          "bool": {
            "must": [
              {
                "term": {
                  "${dto.termKey}": {
                    "value": "${dto.termValue}"
                  }
                }
              }

            ],
            "must_not": [
              {
                "term": {
                  "is_active": {
                    "value": false
                  }
                }
              }
            ]
          }
        },
        "_source": [${_source}],
        "sort" : [],
        "aggs":{}
      }`
    )
  }

  static getBrandDataTemplate (dto: BrandEsDto): string {
    const _source: string = this.arrayToString(dto._source)
    return (
      CONFIG_CONST.HOMEPAGE_URL + '_e?type=brand&body=' +
      `{
        "size":${dto.count},
        "from":0,
        "query":{
          "bool": {    
            "must": [
              {
                "term": {
                  "${dto.termKey}": {
                    "value": "${dto.termValue}"
                  ]
                  }
                }
              }
            ],
            "must_not": [
              {
                "term": {
                  "hide_brand": {
                    "value": 0
                  }
                }
              }
          }
        },
        "_source": [${_source}],
        "sort": [],
        "aggs": {}
      }`
    )
  }

  static getCategoryUrl (dto: MegamenuCategoryDto): string {
    if (item.url_path) {
      return item.url_path
    }
    if (item.value === 'dynamically') {
      return ''
    }
    return item.value
  }
}

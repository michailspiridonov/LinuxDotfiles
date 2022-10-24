import { CONFIG_CONST } from 'cypress/index_'
import {
  ElasticSearchRequestBuilder,
  ExistsTerm,
  Range,
  Term
} from './elastic_search_request_builder'

export type productEsAttributes = 'sku' | 'url_path' | 'drmax_pim_status' | 'final_price' | 'drmax_title_row1' | 'category' | 'drmax_brand_slug'

export class ProductESRequestBuilder extends ElasticSearchRequestBuilder {
  public constructor () {
    super((['it'].includes(CONFIG_CONST.COUNTRY)) || (Cypress.env('environment') === 'cz_upgrade_stage') ? 'products' : 'product')
  }

  public setSize (size: number): ProductESRequestBuilder {
    super.setSize(size)
    return this
  }

  public addTerm (term: Term): ProductESRequestBuilder {
    super.addTerm(term)
    return this
  }

  public addExistsTerm (term: ExistsTerm): ProductESRequestBuilder {
    super.addExistsTerm(term)
    return this
  }

  public addSource (source: productEsAttributes): ProductESRequestBuilder {
    super.addSource(source)
    return this
  }

  public setPimStatuses (pimStatuses: string[], must: boolean = true): ProductESRequestBuilder {
    this.addTerm({ key: 'drmax_pim_status', must, value: pimStatuses })
    return this
  }

  public setOTC (otc: boolean, must: boolean = true): ProductESRequestBuilder {
    this.addTerm({ key: 'drmax_otc', must, value: [String(Number(otc))] })
    return this
  }

  public setFinalPrice (finalPriceRange: Range, must: boolean = true): ProductESRequestBuilder {
    this.addTerm({ key: 'final_price', must, value: finalPriceRange })
    return this
  }

  public setStockSalableQty (stockSalableQtyRange: Range, must: boolean = true): ProductESRequestBuilder {
    this.addTerm({ key: 'drmax_stock_salable_qty', must, value: stockSalableQtyRange })
    return this
  }

  public setStockQty (stockQtyRange: Range, must: boolean = true): ProductESRequestBuilder {
    this.addTerm({ key: 'stock.qty', must, value: stockQtyRange })
    return this
  }

  static getAvailableProducts (count: number): ProductESRequestBuilder {
    const elasticBuilder = (new ProductESRequestBuilder())
      .setSize(count)
      .setPimStatuses(['Available'])
      .setStockQty({ gte: 1 })
      .addExistsTerm({ key: 'custom_options', must: false })

    if (['ro'].includes(CONFIG_CONST.COUNTRY)) { // for cash on delivery Minimum Order Total
      elasticBuilder
        .setFinalPrice({ gte: 25 })
        .setStockSalableQty({ gte: 995 })
        .addTerm({ key: 'max_sale_qty', must: true, value: 10000 })
    }
    return elasticBuilder
  }

  static getNamesOfAvailableProducts (count: number): ProductESRequestBuilder {
    return this.getAvailableProducts(count)
      .addExistsTerm({ key: 'drmax_title_row1', must: true })
      .addSource('drmax_title_row1')
  }

  static getUrlsOfAvailableProducts (count: number): ProductESRequestBuilder {
    return this.getAvailableProducts(count)
      .addExistsTerm({ key: 'url_path', must: true })
      .addSource('url_path')
  }

  static getBrandUrlsOfAvailableProducts (count: number): ProductESRequestBuilder {
    return this.getAvailableProducts(count)
      .addExistsTerm({ key: 'drmax_brand_slug', must: true })
      .addTerm({ key: 'drmax_brand_slug', must: false, value: '' })
      .addSource('drmax_brand_slug')
  }
}

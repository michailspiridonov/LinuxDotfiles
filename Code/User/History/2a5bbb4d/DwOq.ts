import {
  ElasticsearchRequestTemplates,
  ProductEsDto,
  CategoryEsDto,
  BrandEsDto
} from 'cypress/fixtures/api_templates/elasticsearch_request_templates'
import {
  ApiHandler,
  BrandESRequestBuilder,
  CategoryESRequestBuilder,
  MegamenuESRequestBuilder,
  ProductESRequestBuilder,
  accessToken
} from 'cypress/index_'

export class ElasticsearchApiHandler {
  static makeESRequest (url: string): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**ElasticsearchApiHandler.makeESRequest**')
    return ApiHandler.makeRequest({
      url,
      method: 'GET',
      failOnStatusCode: false,
      headers: {
        'CF-Access-Client-Id': accessToken.access_token_id,
        'CF-Access-Client-Secret': accessToken.access_token_secret
      }
    })
  }

  static getData (response: Cypress.Chainable<Cypress.Response<any>>): Cypress.Chainable {
    return response.then((res) => {
      const hits: { _source: any }[] = res.body.hits.hits
      return hits.map((val) => {
        return val._source
      })
    })
  }

  static getProductResponse (dto: ProductEsDto | ProductESRequestBuilder): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**ElasticsearchApiHandler.getProductResponse**')
    const esQueryUrl = (dto instanceof ProductESRequestBuilder) ? dto.build() : ElasticsearchRequestTemplates.getProductsUrl(dto)
    return this.makeESRequest(esQueryUrl)
  }

  static getProductData (dto: ProductEsDto | ProductESRequestBuilder): Cypress.Chainable {
    cy.log('**ElasticsearchApiHandler.getProductData**')
    return this.getData(this.getProductResponse(dto))
  }

  static getProductSKUs (dto: ProductEsDto | ProductESRequestBuilder): Cypress.Chainable {
    cy.log('**ElasticsearchApiHandler.getProductSKUs**')
    return this.getProductData(dto).then((productsRaw) => {
      const products: { sku: string }[] = productsRaw
      return products.map((product) => {
        return product.sku
      })
    })
  }

  static getCategoryResponse (dto: CategoryEsDto | CategoryESRequestBuilder): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**ElasticsearchApiHandler.getCategoryResponse**')
    const esQueryUrl = (dto instanceof CategoryESRequestBuilder) ? dto.build() : ElasticsearchRequestTemplates.getCategoryDataTemplate(dto)
    return this.makeESRequest(esQueryUrl)
  }

  static getCategoryData (dto: CategoryEsDto | CategoryESRequestBuilder): Cypress.Chainable {
    cy.log('**ElasticsearchApiHandler.getCategoryData**')
    return this.getData(this.getCategoryResponse(dto))
  }

  static getAvailableProduct (): Cypress.Chainable {
    cy.log('**ElasticsearchApiHandler.getNameOfAvailableProduct**')
    const elasticBuilder = ProductESRequestBuilder.getAvailableProducts(20)
    return this.getProductData(elasticBuilder).then((products) => {
      return Cypress._.sample(products)
    })
  }

  static getNameOfAvailableProduct (): Cypress.Chainable {
    cy.log('**ElasticsearchApiHandler.getNameOfAvailableProduct**')
    const elasticBuilder = ProductESRequestBuilder.getNamesOfAvailableProducts(20)
    return this.getProductData(elasticBuilder).then((names) => {
      return Cypress._.sample(names).drmax_title_row1
    })
  }

  static getUrlOfAvailableProduct (): Cypress.Chainable {
    cy.log('**ElasticsearchApiHandler.getUrlOfAvailableProduct**')
    const elasticBuilder = ProductESRequestBuilder.getUrlsOfAvailableProducts(20)
    return this.getProductData(elasticBuilder).then((urls) => {
      return Cypress._.sample(urls).url_path
    })
  }

  static getBrandUrlOfAvailableProduct (): Cypress.Chainable {
    cy.log('**ElasticsearchApiHandler.getBrandUrlOfAvailableProduct**')
    const elasticBuilder = ProductESRequestBuilder.getBrandUrlsOfAvailableProducts(20)
    return this.getProductData(elasticBuilder).then((brandUrls) => {
      return Cypress._.sample(brandUrls).drmax_brand_slug
    })
  }

  static getBrandResponse (dto: BrandEsDto | BrandESRequestBuilder): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**ElasticsearchApiHandler.getBrandResponse**')
    const esQueryUrl = (dto instanceof BrandESRequestBuilder) ? dto.build() : ElasticsearchRequestTemplates.getBrandDataTemplate(dto)
    return this.makeESRequest(esQueryUrl)
  }

  static getBrandData (dto: BrandEsDto | BrandESRequestBuilder): Cypress.Chainable {
    cy.log('**ElasticsearchApiHandler.getBrandData**')
    return this.getData(this.getBrandResponse(dto))
  }

  static getMegamenuItems (): Cypress.Chainable {
    cy.log('**ElasticsearchApiHandler.getMegamenuLinks**')
    const esQueryUrl = new MegamenuESRequestBuilder().build()
    return this.makeESRequest(esQueryUrl)
  }
}

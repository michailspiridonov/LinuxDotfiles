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
  ProductESRequestBuilder,
  accessToken
} from 'cypress/index'

export class ElasticsearchApiHandler {
  static makeESRequest (url: string): Cypress.Chainable<Cypress.Response<any>> {
    cy.log('**ElasticsearchApiHandler.makeESRequest**')
    return ApiHandler.makeRequest({
      url: url,
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
    console.log(esQueryUrl)
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

  static getNameOfOneAvailableProduct (): Cypress.Chainable {
    cy.log('**ElasticsearchApiHandler.getNameOfOneAvailableProduct**')
    const elasticBuilder = ProductESRequestBuilder.getNameOfOneAvailableProduct()
    return this.getProductData(elasticBuilder).then((productNames) => {
      return productNames[0].drmax_title_row1
    })
  }

  static getUrlOfOneAvailableProduct (): Cypress.Chainable {
    cy.log('**ElasticsearchApiHandler.getUrlOfOneAvailableProduct**')
    const elasticBuilder = ProductESRequestBuilder.getUrlOfOneAvailableProduct()
    return this.getProductData(elasticBuilder).then((productNames) => {
      return productNames[0].url_path
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

  static getBrandUrlOfOneAvailableProduct (): Cypress.Chainable {
    cy.log('**ElasticsearchApiHandler.getBrandUrlOfOneAvailableProduct**')
    const elasticBuilder = ProductESRequestBuilder.getBrandUrlOfOneAvailableProduct()
    return this.getProductData(elasticBuilder).then((productNames) => {
      return productNames[0].drmax_brand_slug
    })
  }
}

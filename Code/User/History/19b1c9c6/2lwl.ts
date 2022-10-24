import {
  ApiHandler,
  AdminRequestTemplates,
  CONFIG_CONST
} from 'cypress/index_'

export class AdminRequestHandler {
  static makeHttpRequest (
    url: string,
    method: string,
    query?: string,
    authToken: string = null,
    remainingRepeats?: number
  ): Cypress.Chainable<Cypress.Response<any>> {
    return ApiHandler.({
      url: CONFIG_CONST.DATA.url.rest_base + '/' + url,
      method,
      body: query,
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json'
      },
      auth: { bearer: authToken }
    }, remainingRepeats)
  }

  static createBearerToken (dto?: { username?: string; password?: string }): Cypress.Chainable<string> {
    const query = AdminRequestTemplates.createBearerToken(dto)
    return this.makeHttpRequest('integration/admin/token', 'POST', query).then((response) => {
      return String(response.body)
    })
  }

  static setOrderStatus (
    dto: {
      orderStatus: string
      expireDate?: string
      modifiedDate?: string
    },
    orderId: number,
    authToken: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    const query = AdminRequestTemplates.setOrderStatus(dto)
    return this.makeHttpRequest(`drmax-orders/${orderId}`, 'PUT', query, authToken)
  }

  static getOrderDetail (incrementId: string, authToken: string): Cypress.Chainable<Cypress.Response<any>> {
    return this.makeHttpRequest(
      `orders?searchCriteria[filter_groups][0][filters][0][field]=increment_id&searchCriteria[filter_groups][0][filters][0][value]=${incrementId}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq`,
      'GET',
      null,
      authToken
    )
  }
}

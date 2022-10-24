
export class ApiHandler {
  static makeRequest (requestOptions: Partial<Cypress.RequestOptions>, remainingRepeats: number = 5): Cypress.Chainable<Cypress.Response<any>> {
    return cy
      .request(requestOptions)
      .then((res) => {
        const reqUrlInfo = `url: ${requestOptions.url}`
        const reqBodyInfo = `body: ${requestOptions.body ? JSON.stringify(requestOptions.body).replace(/\\n|\s+(?=\s)/g, '') : undefined}`
        const resInfo = `${JSON.stringify(res.body)}`
        const info = `_request_\n${reqUrlInfo}\n${reqBodyInfo}\n_response_\n${resInfo}`
        if (remainingRepeats === 0) {
          throw new Error(`Too many retries in one request!\n${info}`)
        } else if (res.status !== 200 || res.body.errors) {
          return this.makeRequest(requestOptions, remainingRepeats - 1)
        } else {
          cy.log('_request_')
          cy.log(reqUrlInfo)
          cy.log(reqBodyInfo)
          cy.log('_response_')
          cy.log(resInfo)
          return cy.wrap(res)
        }
      })
  }

  static makeRequest2 (requestOptions: Partial<Cypress.RequestOptions>, remainingRepeats: number = 5): Cypress.Chainable<Cypress.Response<any>> {
    let msg: string
    return cy.waitUntil(() => {
      return cy
        .request(requestOptions)
        .then(res => {
          const reqUrlInfo = `url: ${requestOptions.url}`
          const reqBodyInfo = `body: ${requestOptions.body ? JSON.stringify(requestOptions.body).replace(/\\n|\s+(?=\s)/g, '') : undefined}`
          const resInfo = `${JSON.stringify(res.body)}`
          if (res.status === 201 && !res.body.errors) {
            cy.log('_request_')
            cy.log(reqUrlInfo)
            cy.log(reqBodyInfo)
            cy.log('_response_')
            cy.log(resInfo)
            return cy.wrap(res)
          } else {
            msg = 'aaaaaaaaaaa'
            return false
          }
        })
    }, {
      timeout: 500,
      errorMsg: msg
    })
  }
}

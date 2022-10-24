import { CONFIG_CONST } from 'cypress/index'

export function locate (pathLiteral: string | any): string | undefined {
  if (typeof pathLiteral === 'string') {
    return pathLiteral
  }
  if (pathLiteral[CONFIG_CONST.COUNTRY]) {
    return pathLiteral[CONFIG_CONST.COUNTRY]
  } else {
    return pathLiteral.cmn
  }
}

export function scrollLocated (element: JQuery<HTMLElement>): void {
  if (element.selector && element.length === 1) {
    cy.wrap(element).scrollIntoView({ offset: { top: -600, left: 0 } })
  }
}

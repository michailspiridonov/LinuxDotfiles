export class RandomEmailGenerator {
  static generate (): string {
    return Math.random().toString(36).slice(2) + 'SKSTAGETESTTTT' + '.pjvurmhd@mailosaur.io'
    // return 'qggyljvcoodeeyvczl@bvhrs.com'
  }
}

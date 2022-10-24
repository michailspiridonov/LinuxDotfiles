export class RandomEmailGenerator {
  static generate (): string {
    return Math.random().toString(36).slice(2) + '.MAILTESTpjvurmhd@mailosaur.io'
  }
}

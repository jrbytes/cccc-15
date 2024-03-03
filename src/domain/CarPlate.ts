export default class CarPlate {
  private readonly value: string

  constructor(carPlate: string) {
    if (this.isInvalidCarPlate(carPlate)) {
      throw new Error('Invalid car plate')
    }
    this.value = carPlate
  }

  private isInvalidCarPlate(carPlate: string) {
    return !carPlate.match(/^[A-Z]{3}\d{4}$/)
  }

  getValue() {
    return this.value
  }
}

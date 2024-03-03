import { v4 } from 'uuid'

import Name from './Name'
import { validateCpf } from './validateCpf'

export default class Account {
  private readonly name: Name

  private constructor(
    readonly accountId: string,
    name: string,
    readonly email: string,
    readonly cpf: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly carPlate?: string,
  ) {
    this.name = new Name(name)
    if (this.isInvalidEmail(email)) throw new Error('Invalid email')
    if (!validateCpf(cpf)) throw new Error('Invalid cpf')
    if (isDriver && carPlate && this.isInvalidCarPlate(carPlate)) {
      throw new Error('Invalid car plate')
    }
  }

  private isInvalidEmail(email: string) {
    return !email.match(/^(.+)@(.+)$/)
  }

  private isInvalidCarPlate(carPlate: string) {
    return !carPlate.match(/^[A-Z]{3}\d{4}$/)
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string,
  ) {
    const accountId = v4()
    return new Account(
      accountId,
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate,
    )
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string,
  ) {
    return new Account(
      accountId,
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate,
    )
  }

  getName() {
    return this.name.getValue()
  }
}

import { v4 } from 'uuid'

import CarPlate from './CarPlate'
import Cpf from './Cpf'
import Email from './Email'
import Name from './Name'

export default class Account {
  private readonly name: Name
  private readonly email: Email
  private readonly cpf: Cpf
  private readonly carPlate?: CarPlate

  private constructor(
    readonly accountId: string,
    name: string,
    email: string,
    cpf: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    carPlate?: string,
  ) {
    this.name = new Name(name)
    this.email = new Email(email)
    this.cpf = new Cpf(cpf)
    if (isDriver && carPlate) {
      this.carPlate = new CarPlate(carPlate)
    }
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

  getEmail() {
    return this.email.getValue()
  }

  getCpf() {
    return this.cpf.getValue()
  }

  getCarPlate() {
    return this.carPlate?.getValue()
  }
}

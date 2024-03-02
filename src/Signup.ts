import Account from './Account'
import type AccountRepository from './AccountRepository'

interface SignupInput {
  name: string
  email: string
  cpf: string
  carPlate?: string
  isPassenger: boolean
  isDriver: boolean
}

interface SignupOutput {
  accountId: string
  name: string
  email: string
  cpf: string
  carPlate?: string
  isPassenger: boolean
  isDriver: boolean
}

export default class Signup {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute(input: SignupInput): Promise<SignupOutput> {
    const existingAccount = await this.accountRepository.getByEmail(input.email)
    if (existingAccount) throw new Error('Email already in use')
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.isPassenger,
      input.isDriver,
      input.carPlate,
    )
    await this.accountRepository.save(account)
    return account
  }
}

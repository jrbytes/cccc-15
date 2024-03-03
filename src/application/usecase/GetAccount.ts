import type AccountRepository from '../../infra/repository/AccountRepository'

export default class GetAccount {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<GetAccountOutput | undefined> {
    const account = await this.accountRepository.getById(accountId)
    if (!account) throw new Error('Account does not exist')
    return account
  }
}

interface GetAccountOutput {
  accountId: string
  name: string
  email: string
  cpf: string
  carPlate?: string
  isPassenger: boolean
  isDriver: boolean
}

import type AccountRepository from '../../infra/repository/AccountRepository'

export default class GetAccount {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<GetAccountOutput> {
    const account = await this.accountRepository.getById(accountId)
    if (!account) throw new Error('Account does not exist')
    return {
      accountId: account.accountId,
      name: account.getName(),
      email: account.getEmail(),
      cpf: account.getCpf(),
      carPlate: account.getCarPlate(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
    }
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

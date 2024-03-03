import Account from '../../domain/Account'
import type DatabaseConnection from '../database/DatabaseConnection'

export default interface AccountRepository {
  save: (account: Account) => Promise<void>
  getByEmail: (email: string) => Promise<Account | undefined>
  getById: (accountId: string) => Promise<Account | undefined>
}

export interface AccountQueryType {
  account_id: string
  name: string
  email: string
  cpf: string
  is_passenger: boolean
  is_driver: boolean
  car_plate: string
}

export class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(account: Account) {
    await this.connection.query(
      'insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)',
      [
        account.accountId,
        account.getName(),
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
      ],
    )
  }

  async getByEmail(email: string) {
    const [account]: [account: AccountQueryType] = await this.connection.query(
      'select * from cccat15.account where email = $1',
      [email],
    )
    if (!account) return
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.is_passenger,
      account.is_driver,
      account.car_plate,
    )
  }

  async getById(accountId: string) {
    const [account]: [account: AccountQueryType] = await this.connection.query(
      'select * from cccat15.account where account_id = $1',
      [accountId],
    )
    if (!account) return
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.is_passenger,
      account.is_driver,
      account.car_plate,
    )
  }
}

export class AccountDAOMemory implements AccountRepository {
  accounts: any[] = []

  async save(account: any) {
    this.accounts.push(account)
  }

  async getByEmail(email: string) {
    return this.accounts.find((acc: any) => acc.email === email)
  }

  async getById(accountId: string) {
    return this.accounts.find((acc: any) => acc.accountId === accountId)
  }
}

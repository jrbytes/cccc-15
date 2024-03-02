import pgp from 'pg-promise'

import Account from './Account'

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
  async save(account: Account) {
    const connection = pgp()(
      'postgres://postgres:123456@localhost:5432/cccat15',
    )
    await connection.query(
      'insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)',
      [
        account.accountId,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
      ],
    )
    await connection.$pool.end()
  }

  async getByEmail(email: string) {
    const connection = pgp()(
      'postgres://postgres:123456@localhost:5432/cccat15',
    )
    const [account]: [account: AccountQueryType] = await connection.query(
      'select * from cccat15.account where email = $1',
      [email],
    )
    await connection.$pool.end()
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
    const connection = pgp()(
      'postgres://postgres:123456@localhost:5432/cccat15',
    )
    const [account]: [account: AccountQueryType] = await connection.query(
      'select * from cccat15.account where account_id = $1',
      [accountId],
    )
    await connection.$pool.end()
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

import { v4 } from 'uuid'

import Account from '../../src/domain/Account'
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection'
import AccountModel from '../../src/infra/orm/AccountModel'
import ORM from '../../src/infra/orm/ORM'

it('deve testar o ORM', async () => {
  const accountId = v4()
  const accountModel = new AccountModel(
    accountId,
    'John Doe',
    'john.doe@gmail.com',
    '123.456.789-09',
    '',
    true,
    false,
  )
  const connection = new PgPromiseAdapter()
  const orm = new ORM(connection)
  await orm.save(accountModel)
  const getAccountModel = await orm.findBy(
    AccountModel,
    'account_id',
    accountId,
  )
  expect(getAccountModel.name).toBe(accountModel.name)
  expect(getAccountModel.email).toBe(accountModel.email)
  expect(getAccountModel.cpf).toBe(accountModel.cpf)
  expect(getAccountModel.carPlate).toBe(accountModel.carPlate)
  expect(getAccountModel.isPassenger).toBe(accountModel.isPassenger)
  expect(getAccountModel.isDriver).toBe(accountModel.isDriver)
  await connection.close()
})

it('deve testar o ORM com um aggregate real, findBy account_id', async () => {
  const account = Account.create(
    'John Doe',
    'john@gmail.com',
    '97456321558',
    true,
    false,
    '',
  )
  const accountModel = AccountModel.fromAggregate(account)
  const connection = new PgPromiseAdapter()
  const orm = new ORM(connection)
  await orm.save(accountModel)
  const getAccountModel = await orm.findBy(
    AccountModel,
    'account_id',
    account.accountId,
  )
  expect(getAccountModel.name).toBe(accountModel.name)
  expect(getAccountModel.email).toBe(accountModel.email)
  expect(getAccountModel.cpf).toBe(accountModel.cpf)
  expect(getAccountModel.carPlate).toBe(accountModel.carPlate)
  expect(getAccountModel.isPassenger).toBe(accountModel.isPassenger)
  expect(getAccountModel.isDriver).toBe(accountModel.isDriver)
  await connection.close()
})

it('deve testar o ORM com um aggregate real, findBy email', async () => {
  const account = Account.create(
    'John Doe',
    'john@gmail.com',
    '97456321558',
    true,
    false,
    '',
  )
  const accountModel = AccountModel.fromAggregate(account)
  const connection = new PgPromiseAdapter()
  const orm = new ORM(connection)
  await orm.save(accountModel)
  const getAccountModel = await orm.findBy(
    AccountModel,
    'email',
    account.getEmail(),
  )
  expect(getAccountModel.name).toBe(accountModel.name)
  expect(getAccountModel.email).toBe(accountModel.email)
  expect(getAccountModel.cpf).toBe(accountModel.cpf)
  expect(getAccountModel.carPlate).toBe(accountModel.carPlate)
  expect(getAccountModel.isPassenger).toBe(accountModel.isPassenger)
  expect(getAccountModel.isDriver).toBe(accountModel.isDriver)
  await connection.close()
})

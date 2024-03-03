import GetAccount from '../../src/application/usecase/GetAccount'
import Signup from '../../src/application/usecase/Signup'
import type DatabaseConnection from '../../src/infra/database/DatabaseConnection'
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection'
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository'

let connection: DatabaseConnection
let signup: Signup
let getAccount: GetAccount

describe('signup', () => {
  beforeEach(() => {
    connection = new PgPromiseAdapter()
    const accountDAO = new AccountRepositoryDatabase(connection)
    signup = new Signup(accountDAO)
    getAccount = new GetAccount(accountDAO)
  })

  it('deve cadastrar uma conta de passageiro', async () => {
    const input = {
      name: 'Junior Bytes',
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '123.456.789-09',
      isPassenger: true,
      isDriver: false,
    }
    const output = await signup.execute(input)
    expect(output).toMatchObject({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      isPassenger: input.isPassenger,
      isDriver: input.isDriver,
    })
    const outputGetAccount = await getAccount.execute(output.accountId)
    expect(outputGetAccount).toMatchObject({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      isPassenger: input.isPassenger,
    })
  })

  it('deve cadastrar uma conta de motorista', async () => {
    const input = {
      name: 'Junior Bytes',
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '123.456.789-09',
      isPassenger: false,
      isDriver: true,
      carPlate: 'ABC1234',
    }
    const output = await signup.execute(input)
    expect(output).toMatchObject({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      isPassenger: input.isPassenger,
      isDriver: input.isDriver,
      carPlate: input.carPlate,
    })
    const outputGetAccount = await getAccount.execute(output.accountId)
    expect(outputGetAccount).toMatchObject({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      isPassenger: input.isPassenger,
      isDriver: input.isDriver,
      carPlate: input.carPlate,
    })
  })

  it('não deve cadastrar se o nome for inválido', async () => {
    const input = {
      name: '123456',
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '123.456.789-09',
      isPassenger: true,
      isDriver: false,
    }
    await expect(async () => await signup.execute(input)).rejects.toThrowError(
      'Invalid name',
    )
  })

  it('não deve cadastrar se o e-mail for inválido', async () => {
    const input = {
      name: 'Junior Bytes',
      email: `johndoe${Math.random()}`,
      cpf: '123.456.789-09',
      isPassenger: true,
      isDriver: false,
    }
    await expect(async () => await signup.execute(input)).rejects.toThrowError(
      'Invalid email',
    )
  })

  it('não deve cadastrar se o e-mail já estiver em uso', async () => {
    const email = `johndoe${Math.random()}@gmail.com`
    const input = {
      name: 'Junior Bytes',
      email,
      cpf: '123.456.789-09',
      isPassenger: true,
      isDriver: false,
    }
    await signup.execute(input)
    await expect(async () => await signup.execute(input)).rejects.toThrowError(
      'Email already in use',
    )
  })

  it('não deve cadastrar se o cpf for inválido', async () => {
    const input = {
      name: 'Junior Bytes',
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '1',
      isPassenger: true,
      isDriver: false,
    }
    await expect(async () => await signup.execute(input)).rejects.toThrowError(
      'Invalid cpf',
    )
  })

  it('motorista não deve estar sem placa', async () => {
    const input = {
      name: 'Junior Bytes',
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '123.456.789-09',
      isPassenger: false,
      isDriver: true,
      carPlate: 'ABC12345',
    }
    await expect(async () => await signup.execute(input)).rejects.toThrowError(
      'Invalid car plate',
    )
  })

  it('motorista não deve estar com placa fora do padrão', async () => {
    const input = {
      name: 'Junior Bytes',
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '123.456.789-09',
      isPassenger: false,
      isDriver: true,
      carPlate: '123456',
    }
    await expect(async () => await signup.execute(input)).rejects.toThrowError(
      'Invalid car plate',
    )
  })
})

afterEach(async () => {
  await connection.close()
})

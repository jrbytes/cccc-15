import LogDecorator from '../../src/application/decorator/LogDecorator'
import SecurityDecorator from '../../src/application/decorator/SecurityDecorator'
import type AccountGateway from '../../src/application/gateway/AccountGateway'
import GetRide from '../../src/application/usecase/GetRide'
import RequestRide from '../../src/application/usecase/RequestRide'
import type UseCase from '../../src/application/usecase/UseCase'
import type DatabaseConnection from '../../src/infra/database/DatabaseConnection'
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection'
import AccountGatewayHttp from '../../src/infra/gateway/AccountGatewayHttp'
import { AxiosAdapter } from '../../src/infra/http/HttpClient'
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository'

let connection: DatabaseConnection
let requestRide: UseCase
let getRide: GetRide
let accountGateway: AccountGateway

beforeEach(async () => {
  connection = new PgPromiseAdapter()
  const rideRepository = new RideRepositoryDatabase(connection)
  accountGateway = new AccountGatewayHttp(new AxiosAdapter())
  requestRide = new SecurityDecorator(
    new LogDecorator(new RequestRide(rideRepository, accountGateway)),
  )
  getRide = new GetRide(rideRepository, accountGateway)
})

it('deve solicitar uma corrida', async () => {
  const inputSignup = {
    name: 'Junior Bytes',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '123.456.789-09',
    isPassenger: true,
    isDriver: false,
  }

  const outputSignup = await accountGateway.signup(inputSignup)
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.5630991,
    fromLong: -48.6565712,
    toLat: -27.581092,
    toLong: -48.593673,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  expect(outputRequestRide.rideId).toBeDefined()
  const outputGetRide = await getRide.execute(
    outputRequestRide.rideId as string,
  )
  expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId)
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId)
  expect(outputGetRide.fromLat).toBe(Number(inputRequestRide.fromLat))
  expect(outputGetRide.status).toBe('requested')
  expect(outputGetRide.date).toBeDefined()
})

afterEach(async () => {
  await connection.close()
})

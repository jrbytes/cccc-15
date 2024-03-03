import GetRide from '../../src/application/usecase/GetRide'
import RequestRide from '../../src/application/usecase/RequestRide'
import Signup from '../../src/application/usecase/Signup'
import type DatabaseConnection from '../../src/infra/database/DatabaseConnection'
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection'
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository'
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository'

let connection: DatabaseConnection
let requestRide: RequestRide
let signup: Signup
let getRide: GetRide

beforeEach(async () => {
  connection = new PgPromiseAdapter()
  const rideRepository = new RideRepositoryDatabase(connection)
  const accountRepository = new AccountRepositoryDatabase(connection)
  requestRide = new RequestRide(rideRepository, accountRepository)
  signup = new Signup(accountRepository)
  getRide = new GetRide(rideRepository, accountRepository)
})

it('deve solicitar uma corrida', async () => {
  const inputSignup = {
    name: 'Junior Bytes',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '123.456.789-09',
    isPassenger: true,
    isDriver: false,
  }

  const outputSignup = await signup.execute(inputSignup)
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.5630991,
    fromLong: -48.6565712,
    toLat: -27.581092,
    toLong: -48.593673,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  expect(outputRequestRide.rideId).toBeDefined()
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId)
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId)
  expect(outputGetRide.fromLat).toBe(Number(inputRequestRide.fromLat))
  expect(outputGetRide.status).toBe('requested')
  expect(outputGetRide.date).toBeDefined()
})

afterEach(async () => {
  await connection.close()
})

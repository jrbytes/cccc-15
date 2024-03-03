import AcceptRide from '../../src/application/usecase/AcceptRide'
import GetRide from '../../src/application/usecase/GetRide'
import RequestRide from '../../src/application/usecase/RequestRide'
import Signup from '../../src/application/usecase/Signup'
import StartRide from '../../src/application/usecase/StartRide'
import type DatabaseConnection from '../../src/infra/database/DatabaseConnection'
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection'
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository'
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository'

let connection: DatabaseConnection
let requestRide: RequestRide
let signup: Signup
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide

beforeEach(async () => {
  connection = new PgPromiseAdapter()
  const rideRepository = new RideRepositoryDatabase(connection)
  const accountRepository = new AccountRepositoryDatabase(connection)
  requestRide = new RequestRide(rideRepository, accountRepository)
  signup = new Signup(accountRepository)
  getRide = new GetRide(rideRepository, accountRepository)
  acceptRide = new AcceptRide(rideRepository, accountRepository)
  startRide = new StartRide(rideRepository)
})

it('deve iniciar uma corrida', async () => {
  const inputSignupPassenger = {
    name: 'Junior Bytes',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '123.456.789-09',
    isPassenger: true,
    isDriver: false,
  }
  const outputSignupPassenger = await signup.execute(inputSignupPassenger)
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.5630991,
    fromLong: -48.6565712,
    toLat: -27.581092,
    toLong: -48.593673,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputSignupDriver = {
    name: 'Junior Bytes',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '123.456.789-09',
    isPassenger: false,
    carPlate: 'AAA9999',
    isDriver: true,
  }
  const outputSignupDriver = await signup.execute(inputSignupDriver)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  }
  await startRide.execute(inputStartRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('in_progress')
})

afterEach(async () => {
  await connection.close()
})

import sinon from 'sinon'

import type AccountGateway from '../../src/application/gateway/AccountGateway'
import AcceptRide from '../../src/application/usecase/AcceptRide'
import FinishRide from '../../src/application/usecase/FinishRide'
import GetRide from '../../src/application/usecase/GetRide'
import RequestRide from '../../src/application/usecase/RequestRide'
import StartRide from '../../src/application/usecase/StartRide'
import UpdatePosition from '../../src/application/usecase/UpdatePosition'
import type DatabaseConnection from '../../src/infra/database/DatabaseConnection'
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection'
import AccountGatewayHttp from '../../src/infra/gateway/AccountGatewayHttp'
import { FetchAdapter } from '../../src/infra/http/HttpClient'
import { PositionRepositoryDatabase } from '../../src/infra/repository/PositionRepository'
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository'

let connection: DatabaseConnection
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let updatePosition: UpdatePosition
let accountGateway: AccountGateway
let finishRide: FinishRide

beforeEach(async () => {
  connection = new PgPromiseAdapter()
  const rideRepository = new RideRepositoryDatabase(connection)
  const positionRepository = new PositionRepositoryDatabase(connection)
  accountGateway = new AccountGatewayHttp(new FetchAdapter())
  requestRide = new RequestRide(rideRepository, accountGateway)
  getRide = new GetRide(rideRepository, accountGateway)
  acceptRide = new AcceptRide(rideRepository, accountGateway)
  startRide = new StartRide(rideRepository)
  updatePosition = new UpdatePosition(rideRepository, positionRepository)
  finishRide = new FinishRide(rideRepository)
})

it('deve finalizar uma corrida em horário normal', async () => {
  const dateStub = sinon.useFakeTimers(new Date('2024-03-07T19:00:00-03:00'))
  const inputSignupPassenger = {
    name: 'Junior Bytes',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '123.456.789-09',
    isPassenger: true,
    isDriver: false,
  }
  const outputSignupPassenger =
    await accountGateway.signup(inputSignupPassenger)
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
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
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  }
  await startRide.execute(inputStartRide)
  const inputUpdatePosition = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
  }
  await updatePosition.execute(inputUpdatePosition)
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  }
  await finishRide.execute(inputFinishRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.fare).toBe(21)
  expect(outputGetRide.status).toBe('completed')
  dateStub.restore()
})

it('deve finalizar uma corrida em horário adicional noturno', async () => {
  const dateStub = sinon.useFakeTimers(new Date('2024-03-07T00:00:00-03:00'))
  const inputSignupPassenger = {
    name: 'Junior Bytes',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '123.456.789-09',
    isPassenger: true,
    isDriver: false,
  }
  const outputSignupPassenger =
    await accountGateway.signup(inputSignupPassenger)
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
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
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  }
  await startRide.execute(inputStartRide)
  const inputUpdatePosition = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
  }
  await updatePosition.execute(inputUpdatePosition)
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  }
  await finishRide.execute(inputFinishRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.fare).toBe(39)
  expect(outputGetRide.status).toBe('completed')
  dateStub.restore()
})

afterEach(async () => {
  await connection.close()
})

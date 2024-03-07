import type AccountGateway from '../../src/application/gateway/AccountGateway'
import AcceptRide from '../../src/application/usecase/AcceptRide'
import GetPositions from '../../src/application/usecase/GetPositions'
import GetRide from '../../src/application/usecase/GetRide'
import RequestRide from '../../src/application/usecase/RequestRide'
import StartRide from '../../src/application/usecase/StartRide'
import UpdatePosition from '../../src/application/usecase/UpdatePosition'
import type DatabaseConnection from '../../src/infra/database/DatabaseConnection'
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection'
import AccountGatewayHttp from '../../src/infra/gateway/AccountGatewayHttp'
import { PositionRepositoryDatabase } from '../../src/infra/repository/PositionRepository'
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository'

let connection: DatabaseConnection
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let updatePosition: UpdatePosition
let getPositions: GetPositions
let accountGateway: AccountGateway

beforeEach(async () => {
  connection = new PgPromiseAdapter()
  const rideRepository = new RideRepositoryDatabase(connection)
  const positionRepository = new PositionRepositoryDatabase(connection)
  accountGateway = new AccountGatewayHttp()
  requestRide = new RequestRide(rideRepository, accountGateway)
  getRide = new GetRide(rideRepository, accountGateway)
  acceptRide = new AcceptRide(rideRepository, accountGateway)
  startRide = new StartRide(rideRepository)
  updatePosition = new UpdatePosition(rideRepository, positionRepository)
  getPositions = new GetPositions(positionRepository)
})

it('deve iniciar uma corrida', async () => {
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
    lat: -27.581092,
    long: -48.593673,
  }
  await updatePosition.execute(inputUpdatePosition)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.distance).toBe(7)
  expect(outputGetRide.lastLat).toBe(-27.581092)
  expect(outputGetRide.lastLong).toBe(-48.593673)
  const outputGetPositions = await getPositions.execute(
    outputRequestRide.rideId,
  )
  expect(outputGetPositions[0].lat).toBe(-27.581092)
  expect(outputGetPositions[0].long).toBe(-48.593673)
})

afterEach(async () => {
  await connection.close()
})

import type AccountGateway from '../../src/application/gateway/AccountGateway'
import UpdateRideProjectionHandler from '../../src/application/handler/UpdateRideProjectionHandler'
import GetRideProjectionQuery from '../../src/application/query/GetRideProjectionQuery'
import AcceptRide from '../../src/application/usecase/AcceptRide'
import RequestRide from '../../src/application/usecase/RequestRide'
import StartRide from '../../src/application/usecase/StartRide'
import type DatabaseConnection from '../../src/infra/database/DatabaseConnection'
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection'
import AccountGatewayHttp from '../../src/infra/gateway/AccountGatewayHttp'
import { AxiosAdapter } from '../../src/infra/http/HttpClient'
import { RabbitMQAdapter } from '../../src/infra/queue/Queue'
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository'

let connection: DatabaseConnection
let requestRide: RequestRide
let acceptRide: AcceptRide
let startRide: StartRide
let accountGateway: AccountGateway

beforeEach(async () => {
  connection = new PgPromiseAdapter()
  const rideRepository = new RideRepositoryDatabase(connection)
  accountGateway = new AccountGatewayHttp(new AxiosAdapter())
  requestRide = new RequestRide(rideRepository, accountGateway)
  acceptRide = new AcceptRide(rideRepository, accountGateway)
  const queue = new RabbitMQAdapter()
  await queue.connect()
  startRide = new StartRide(rideRepository, queue)
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

  const updateRideProjectionHandler = new UpdateRideProjectionHandler(
    connection,
  )
  await updateRideProjectionHandler.execute(outputRequestRide.rideId)
  const getRideProjectionQuery = new GetRideProjectionQuery(connection)
  const outputGetRideProjectionQuery = await getRideProjectionQuery.execute(
    outputRequestRide.rideId,
  )
  console.log(outputGetRideProjectionQuery)
})

afterEach(async () => {
  await connection.close()
})

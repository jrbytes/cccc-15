import FinishRide from './application/usecase/FinishRide'
import GetRide from './application/usecase/GetRide'
import ProcessPayment from './application/usecase/ProcessPayment'
import RequestRide from './application/usecase/RequestRide'
import { PgPromiseAdapter } from './infra/database/DatabaseConnection'
import Registry from './infra/di/Registry'
import AccountGatewayHttp from './infra/gateway/AccountGatewayHttp'
import { AxiosAdapter } from './infra/http/HttpClient'
import { ExpressAdapter } from './infra/http/HttpServer'
import MainController from './infra/http/MainController'
import Mediator from './infra/mediator/Mediator'
import { RideRepositoryDatabase } from './infra/repository/RideRepository'

const httpServer = new ExpressAdapter()
const connection = new PgPromiseAdapter()
const rideRepository = new RideRepositoryDatabase(connection)
const accountGateway = new AccountGatewayHttp(new AxiosAdapter())
const processPayment = new ProcessPayment(rideRepository)
const mediator = new Mediator()
mediator.register('rideCompleted', async (input: any) => {
  await processPayment.execute(input.rideId as string)
})
const requestRide = new RequestRide(rideRepository, accountGateway)
const finishRide = new FinishRide(rideRepository, mediator)
const getRide = new GetRide(rideRepository, accountGateway)
const registry = Registry.getInstance()
registry.register('requestRide', requestRide)
registry.register('getRide', getRide)
registry.register('finishRide', finishRide)
new MainController(httpServer)
httpServer.listen(3000)

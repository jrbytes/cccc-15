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
import { RabbitMQAdapter } from './infra/queue/Queue'
import QueueController from './infra/queue/QueueController'
import { RideRepositoryDatabase } from './infra/repository/RideRepository'

async function main() {
  const httpServer = new ExpressAdapter()
  const connection = new PgPromiseAdapter()
  const queue = new RabbitMQAdapter()
  await queue.connect()
  const rideRepository = new RideRepositoryDatabase(connection)
  const accountGateway = new AccountGatewayHttp(new AxiosAdapter())
  const requestRide = new RequestRide(rideRepository, accountGateway)
  const processPayment = new ProcessPayment(rideRepository)
  const mediator = new Mediator()
  mediator.register('rideCompleted', async (input: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await processPayment.execute(input.rideId)
  })
  // const finishRide = new FinishRide(rideRepository, mediator, queue)
  const getRide = new GetRide(rideRepository, accountGateway)
  const registry = Registry.getInstance()
  registry.register('requestRide', requestRide)
  registry.register('getRide', getRide)
  // registry.register('finishRide', finishRide)
  new MainController(httpServer)
  new QueueController(queue, processPayment)
  httpServer.listen(3000)
}

void main()

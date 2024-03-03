import GetAccount from './application/usecase/GetAccount'
import GetRide from './application/usecase/GetRide'
import RequestRide from './application/usecase/RequestRide'
import Signup from './application/usecase/Signup'
import { PgPromiseAdapter } from './infra/database/DatabaseConnection'
import { ExpressAdapter } from './infra/http/HttpServer'
import MainController from './infra/http/MainController'
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository'
import { RideRepositoryDatabase } from './infra/repository/RideRepository'

const httpServer = new ExpressAdapter()
const connection = new PgPromiseAdapter()
const accountRepository = new AccountRepositoryDatabase(connection)
const rideRepository = new RideRepositoryDatabase(connection)
const signup = new Signup(accountRepository)
const getAccount = new GetAccount(accountRepository)
const requestRide = new RequestRide(rideRepository, accountRepository)
const getRide = new GetRide(rideRepository, accountRepository)
new MainController(httpServer, signup, getAccount, requestRide, getRide)
httpServer.listen(3000)

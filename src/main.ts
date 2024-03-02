import { AccountRepositoryDatabase } from './AccountRepository'
import { PgPromiseAdapter } from './DatabaseConnection'
import GetAccount from './GetAccount'
import GetRide from './GetRide'
import { ExpressAdapter } from './HttpServer'
import MainController from './MainController'
import RequestRide from './RequestRide'
import { RideRepositoryDatabase } from './RideRepository'
import Signup from './Signup'

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

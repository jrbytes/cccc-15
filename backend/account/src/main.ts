import GetAccount from './application/usecase/GetAccount'
import Signup from './application/usecase/Signup'
import { PgPromiseAdapter } from './infra/database/DatabaseConnection'
import Registry from './infra/di/Registry'
import { ExpressAdapter } from './infra/http/HttpServer'
import MainController from './infra/http/MainController'
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository'

const httpServer = new ExpressAdapter()
const connection = new PgPromiseAdapter()
const accountRepository = new AccountRepositoryDatabase(connection)
const signup = new Signup(accountRepository)
const getAccount = new GetAccount(accountRepository)
const registry = Registry.getInstance()
registry.register('signup', signup)
registry.register('getAccount', getAccount)
new MainController(httpServer)
httpServer.listen(3001)

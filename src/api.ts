import express from 'express'

import { AccountRepositoryDatabase } from './AccountRepository'
import GetAccount from './GetAccount'
import GetRide from './GetRide'
import RequestRide from './RequestRide'
import { RideRepositoryDatabase } from './RideRepository'
import Signup from './Signup'
const app = express()
app.use(express.json())
app.post('/signup', async (req, res) => {
  const accountDAO = new AccountRepositoryDatabase()
  const signup = new Signup(accountDAO)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const output = await signup.execute(req.body)
  res.json(output)
})
app.get('/accounts/:accountId', async (req, res) => {
  const accountDAO = new AccountRepositoryDatabase()
  const getAccount = new GetAccount(accountDAO)
  const output = await getAccount.execute(req.params.accountId)
  res.json(output)
})
app.post('/request_ride', async (req, res) => {
  try {
    const accountRepository = new AccountRepositoryDatabase()
    const rideRepository = new RideRepositoryDatabase()
    const requestRide = new RequestRide(rideRepository, accountRepository)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const output = await requestRide.execute(req.body)
    res.json(output)
  } catch (e: any) {
    return res.status(422).json({ message: e.message })
  }
})
app.get('/rides/:rideId', async (req, res) => {
  const rideRepository = new RideRepositoryDatabase()
  const accountRepository = new AccountRepositoryDatabase()
  const getRide = new GetRide(rideRepository, accountRepository)
  const ride = await getRide.execute(req.params.rideId)
  res.json(ride)
})
app.listen(3000)

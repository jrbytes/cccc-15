import express from 'express';
import { AccountDAODatabase } from './AccountDAO';
import Signup from './Signup';
import GetAccount from './GetAccount';
import { v4 } from 'uuid';
import pgp from 'pg-promise';
const app = express();
app.use(express.json());
app.post('/signup', async (req, res) => {
  const accountDAO = new AccountDAODatabase()
  const signup = new Signup(accountDAO);
  const output = await signup.execute(req.body)
  res.json(output)
})
app.get('/accounts/:accountId', async (req, res) => {
  const accountDAO = new AccountDAODatabase()
  const getAccount = new GetAccount(accountDAO);
  const output = await getAccount.execute(req.params.accountId)
  res.json(output)
})
app.post('/request_ride', async (req, res) => {
  const rideId = v4()
  const connection = pgp()("postgres://postgres:123456@localhost:5432/cccat15")
  const [account] = await connection.query("SELECT * FROM cccat15.account where account_id = $1", [req.body.passengerId])
  if (!account.is_passenger) {
    return res.status(422).json({ message: 'Account is not from a passenger' })
  }
  const [activeRide] = await connection.query("SELECT * FROM cccat15.ride where passenger_id = $1 AND status = 'requested'", [req.body.passengerId])
  if (activeRide) {
    return res.status(422).json({ message: 'Passenger has an active ride' })
  }
  await connection.query("INSERT INTO cccat15.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
  [rideId, req.body.passengerId, req.body.fromLat, req.body.fromLong, req.body.toLat, req.body.toLong, 'requested', new Date()])
  await connection.$pool.end()
  res.json({ rideId })
})
app.get('/rides/:rideId', async (req, res) => {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/cccat15")
  const [ride] = await connection.query("SELECT * FROM cccat15.ride where ride_id = $1", [req.params.rideId])
  await connection.$pool.end()
  res.json(ride)
})
app.listen(3000);
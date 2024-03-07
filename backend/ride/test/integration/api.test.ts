import axios from 'axios'

axios.defaults.validateStatus = () => true

it('deve cadastrar uma conta de passageiro', async () => {
  const input = {
    name: 'Junior Bytes',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '123.456.789-09',
    isPassenger: true,
    isDriver: false,
  }
  const responseSignup = await axios.post('http://localhost:3001/signup', input)
  const outputSignup = responseSignup.data
  expect(outputSignup.name.value).toBe(input.name)
  expect(outputSignup.email.value).toBe(input.email)
  expect(outputSignup.cpf.value).toBe(input.cpf)
  expect(outputSignup.isPassenger).toBe(input.isPassenger)
  expect(outputSignup.isDriver).toBe(input.isDriver)
  const responseGetAccount = await axios.get(
    `http://localhost:3001/accounts/${outputSignup.accountId}`,
  )
  const outputAccount = responseGetAccount.data
  expect(outputAccount.name).toBe(input.name)
  expect(outputAccount.email).toBe(input.email)
  expect(outputAccount.cpf).toBe(input.cpf)
  expect(outputAccount.isPassenger).toBe(input.isPassenger)
})

it('deve solicitar uma corrida', async () => {
  const inputSignup = {
    name: 'Junior Bytes',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '123.456.789-09',
    isPassenger: true,
    isDriver: false,
  }
  const responseSignup = await axios.post(
    'http://localhost:3001/signup',
    inputSignup,
  )
  const outputSignup = responseSignup.data
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.5630991,
    fromLong: -48.6565712,
    toLat: -27.581092,
    toLong: -48.593673,
  }
  const responseRequestRide = await axios.post(
    'http://localhost:3000/request_ride',
    inputRequestRide,
  )
  const outputRequestRide = responseRequestRide.data
  expect(outputRequestRide.rideId).toBeDefined()
  const responseGetRide = await axios.get(
    `http://localhost:3000/rides/${outputRequestRide.rideId}`,
  )
  const outputGetRide = responseGetRide.data
  expect(responseRequestRide.status).toBe(200)
  expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId)
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId)
  expect(outputGetRide.fromLat).toBe(Number(inputRequestRide.fromLat))
  expect(outputGetRide.status).toBe('requested')
  expect(outputGetRide.date).toBeDefined()
})

it('não deve solicitar uma corrida se não for passageiro', async () => {
  const inputSignup = {
    name: 'Junior Bytes',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '123.456.789-09',
    carPlate: 'ABC1234',
    isPassenger: false,
    isDriver: true,
  }
  const responseSignup = await axios.post(
    'http://localhost:3001/signup',
    inputSignup,
  )
  const outputSignup = responseSignup.data
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.5630991,
    fromLong: -48.6565712,
    toLat: -27.581092,
    toLong: -48.593673,
  }
  const responseRequestRide = await axios.post(
    'http://localhost:3000/request_ride',
    inputRequestRide,
  )
  const outputRequestRide = responseRequestRide.data
  expect(responseRequestRide.status).toBe(422)
  expect(outputRequestRide.message).toBe('Account is not from a passenger')
})

it('não deve solicitar uma corrida se o passageiro tiver outra corrida com outra corrida ativa', async () => {
  const inputSignup = {
    name: 'Junior Bytes',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '123.456.789-09',
    isPassenger: true,
  }
  const responseSignup = await axios.post(
    'http://localhost:3001/signup',
    inputSignup,
  )
  const outputSignup = responseSignup.data
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.5630991,
    fromLong: -48.6565712,
    toLat: -27.581092,
    toLong: -48.593673,
  }
  await axios.post('http://localhost:3000/request_ride', inputRequestRide)
  const responseRequestRide = await axios.post(
    'http://localhost:3000/request_ride',
    inputRequestRide,
  )
  const outputRequestRide = responseRequestRide.data
  expect(responseRequestRide.status).toBe(422)
  expect(outputRequestRide.message).toBe('Passenger has an active ride')
})

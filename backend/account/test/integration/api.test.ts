import axios from 'axios'

axios.defaults.validateStatus = () => true

it.skip('deve cadastrar uma conta de passageiro', async () => {
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

it('deve cadastrar uma conta de passageiro de forma assincrona', async () => {
  const input = {
    name: 'Junior Bytes',
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '123.456.789-09',
    isPassenger: true,
    isDriver: false,
  }
  await axios.post('http://localhost:3001/signup_async', input)
})

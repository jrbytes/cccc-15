import axios from "axios";

it('deve cadastrar uma conta de passageiro', async () => {
  const input = {
    name: "Junior Bytes",
    email: `johndoe${Math.random()}@gmail.com`,
    cpf: '123.456.789-09',
    isPassenger: true,
    isDriver: false
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  const outputSignup = responseSignup.data;
  expect(outputSignup).toMatchObject({
    name: input.name,
    email: input.email, 
    cpf: input.cpf,
    isPassenger: input.isPassenger,
    isDriver: input.isDriver,
  })
  const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
  const outputAccount = responseGetAccount.data;
  expect(outputAccount).toMatchObject({
    name: input.name,
    email: input.email,
    cpf: input.cpf,
    is_passenger: input.isPassenger,
  })
})
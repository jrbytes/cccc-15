import { signup } from "../src/signup";


describe('signup', () => {
  it('não deve cadastrar se o nome for inválido', async () => {
    const input = {
      name: "123456",
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '123.456.789-09',
      isPassenger: true,
      isDriver: false
    }
    const renderSignup = await signup(input);
    expect(renderSignup).toBe(-3);
  })

  it('não deve cadastrar se o e-mail for inválido', async () => {
    const input = {
      name: "Junior Bytes",
      email: `johndoe${Math.random()}`,
      cpf: '123.456.789-09',
      isPassenger: true,
      isDriver: false
    }
    const renderSignup = await signup(input);
    expect(renderSignup).toBe(-2);
  })

  it('não deve cadastrar se o e-mail já existir', async () => {
    const email = `johndoe${Math.random()}@gmail.com`;
    const input = {
      name: "Junior Bytes",
      email,
      cpf: '123.456.789-09',
      isPassenger: true,
      isDriver: false
    }
    await signup(input);
    const renderSignup = await signup(input);
    expect(renderSignup).toBe(-4);
  })

  it('não deve cadastrar se o cpf for inválido', async () => {
    const input = {
      name: "Junior Bytes",
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '1',
      isPassenger: true,
      isDriver: false
    }
    const renderSignup = await signup(input);
    expect(renderSignup).toBe(-1);
  })

  it('motorista não deve estar sem placa', async () => {
    const input = {
      name: "Junior Bytes",
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '123.456.789-09',
      isPassenger: false,
      isDriver: true,
    }
    const renderSignup = await signup(input);
    expect(renderSignup).toBe(-5);
  })

  it('motorista não deve estar com placa fora do padrão', async () => {
    const input = {
      name: "Junior Bytes",
      email: `johndoe${Math.random()}@gmail.com`,
      cpf: '123.456.789-09',
      isPassenger: false,
      isDriver: true,
      carPlate: "123456"
    }
    const renderSignup = await signup(input);
    expect(renderSignup).toBe(-5);
  })
})
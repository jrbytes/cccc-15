import HttpClient from "../http/HttpClient"

export default interface AccountGateway {
  signup: (input: SignupInput) => Promise<SignupOutput>
}

type SignupInput = {
  isPassenger: boolean
  name: string
  email: string
  cpf: string
}

type SignupOutput = {
  accountId: string
}

export class AccountGatewayHttp implements AccountGateway {
  constructor(readonly httpClient: HttpClient) {}

  signup = async (input: SignupInput): Promise<SignupOutput> => {
    const output = await this.httpClient.post('http://localhost:3001/signup', input)
    console.log(input, output)
    return {
      accountId: output.accountId
    }
  }
}
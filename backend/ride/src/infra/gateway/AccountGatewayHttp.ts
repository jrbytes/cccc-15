import type AccountGateway from '../../application/gateway/AccountGateway'
import type HttpClient from '../http/HttpClient'

export default class AccountGatewayHttp implements AccountGateway {
  constructor(readonly httpClient: HttpClient) {}

  async getById(accountId: string): Promise<any> {
    return await this.httpClient.get(
      `http://localhost:3001/accounts/${accountId}`,
    )
  }

  async signup(input: any): Promise<any> {
    return await this.httpClient.post(`http://localhost:3001/signup`, input)
  }
}

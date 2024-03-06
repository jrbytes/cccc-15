import axios from 'axios'

import type AccountGateway from '../../application/gateway/AccountGateway'

export default class AccountGatewayHttp implements AccountGateway {
  async getById(accountId: string): Promise<any> {
    const response = await axios.get(
      `http://localhost:3001/accounts/${accountId}`,
    )
    return response.data
  }
}

import type Signup from '../../application/usecase/Signup'
import Registry, { inject } from '../di/Registry'
import type HttpServer from './HttpServer'

export default class MainController {
  @inject('signup')
  signup?: Signup

  constructor(httpServer: HttpServer) {
    const registry = Registry.getInstance()
    httpServer.register('post', '/signup', async (params: any, body: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const output = await this.signup?.execute(body)
      return output
    })
    httpServer.register(
      'get',
      '/accounts/:accountId',
      async function (params: any, body: any) {
        const output = await registry
          .inject('getAccount')
          .execute(params.accountId)
        return output
      },
    )
    httpServer.register(
      'post',
      '/request_ride',
      async function (params: any, body: any) {
        const output = await registry.inject('requestRide').execute(body)
        return output
      },
    )
    httpServer.register(
      'get',
      '/rides/:rideId',
      async function (params: any, body: any) {
        const ride = await registry.inject('getRide').execute(params.rideId)
        return ride
      },
    )
  }
}

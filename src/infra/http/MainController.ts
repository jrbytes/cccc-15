import type GetAccount from '../../application/usecase/GetAccount'
import type GetRide from '../../application/usecase/GetRide'
import type RequestRide from '../../application/usecase/RequestRide'
import type Signup from '../../application/usecase/Signup'
import type HttpServer from './HttpServer'

export default class MainController {
  constructor(
    httpServer: HttpServer,
    signup: Signup,
    getAccount: GetAccount,
    requestRide: RequestRide,
    getRide: GetRide,
  ) {
    httpServer.register(
      'post',
      '/signup',
      async function (params: any, body: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const output = await signup.execute(body)
        return output
      },
    )
    httpServer.register(
      'get',
      '/accounts/:accountId',
      async function (params: any, body: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const output = await getAccount.execute(params.accountId)
        return output
      },
    )
    httpServer.register(
      'post',
      '/request_ride',
      async function (params: any, body: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const output = await requestRide.execute(body)
        return output
      },
    )
    httpServer.register(
      'get',
      '/rides/:rideId',
      async function (params: any, body: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const ride = await getRide.execute(params.rideId)
        return ride
      },
    )
  }
}

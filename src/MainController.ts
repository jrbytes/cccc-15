import type GetAccount from './GetAccount'
import type GetRide from './GetRide'
import type HttpServer from './HttpServer'
import type RequestRide from './RequestRide'
import type Signup from './Signup'

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

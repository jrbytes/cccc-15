import type UpdateRideProjectionHandler from '../../application/handler/UpdateRideProjectionHandler'
import type ProcessPayment from '../../application/usecase/ProcessPayment'
import type Queue from './Queue'

export default class QueueController {
  constructor(
    queue: Queue,
    processPayment: ProcessPayment,
    updateRideProjectionHandler: UpdateRideProjectionHandler,
  ) {
    void queue.consume('rideCompleted', async function (input: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await processPayment.execute(input)
    })
    void queue.consume('rideStarted', async function (input: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await updateRideProjectionHandler.execute(input.rideId)
    })
  }
}

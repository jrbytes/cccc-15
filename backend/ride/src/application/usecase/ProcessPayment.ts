import type RideRepository from '../../infra/repository/RideRepository'

export default class ProcessPayment {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(rideId: string) {
    console.log('Processing payment for ride: ', rideId)
  }
}

import type RideRepository from '../../infra/repository/RideRepository'

export default class ProcessPayment {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(input: Input) {
    console.log('Processing payment for ride: ', input)
  }
}

interface Input {
  rideId: string
  creditCardToken: string
  amount: number
}

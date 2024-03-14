import type RideRepository from '../../infra/repository/RideRepository'

export default class ProcessPayment {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(input: Input) {
    console.log(`RabbitMQ :: ProcessingPayment for Ride :: ${input.rideId}`)
  }
}

interface Input {
  rideId: string
  creditCardToken: string
  amount: number
}

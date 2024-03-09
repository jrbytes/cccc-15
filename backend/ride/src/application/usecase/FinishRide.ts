import type Mediator from '../../infra/mediator/Mediator'
import type RideRepository from '../../infra/repository/RideRepository'

export default class FinishRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly mediator: Mediator,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId)
    if (!ride) throw new Error('Ride not found')
    ride.finish()
    console.log('FinishRide-getFare()', ride.getFare())
    await this.rideRepository.update(ride)
    await this.mediator.notify('rideCompleted', { rideId: ride.rideId })
  }
}

interface Input {
  rideId: string
}

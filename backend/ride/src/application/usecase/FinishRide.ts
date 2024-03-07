import type RideRepository from '../../infra/repository/RideRepository'

export default class FinishRide {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId)
    if (!ride) throw new Error('Ride not found')
    ride.finish()
    await this.rideRepository.update(ride)
  }
}

interface Input {
  rideId: string
}

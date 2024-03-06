import type AccountRepository from '../../infra/repository/AccountRepository'
import type RideRepository from '../../infra/repository/RideRepository'

export default class AcceptRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountRepository: AccountRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId)
    if (!ride) throw new Error('Ride not found')
    ride.accept(input.driverId)
    await this.rideRepository.update(ride)
  }
}

interface Input {
  rideId: string
  driverId: string
}

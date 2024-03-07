import type RideRepository from '../../infra/repository/RideRepository'
import type AccountGateway from '../gateway/AccountGateway'

export default class AcceptRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountGateway: AccountGateway,
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

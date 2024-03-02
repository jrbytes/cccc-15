import type AccountRepository from './AccountRepository'
import Ride from './Ride'
import type RideRepository from './RideRepository'

export default class RequestRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountRepository: AccountRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong,
    )
    const account = await this.accountRepository.getById(input.passengerId)
    if (!account) throw new Error('Account does not exist')
    if (!account?.isPassenger)
      throw new Error('Account is not from a passenger')
    const [activeRide] = await this.rideRepository.getActiveRidesByPassengerId(
      input.passengerId,
    )
    if (activeRide) throw new Error('Passenger has an active ride')
    await this.rideRepository.save(ride)
    return { rideId: ride.rideId }
  }
}

interface Input {
  passengerId: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
}

interface Output {
  rideId: string
}

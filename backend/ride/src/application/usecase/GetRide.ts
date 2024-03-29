import type RideRepository from '../../infra/repository/RideRepository'
import type AccountGateway from '../gateway/AccountGateway'

export default class GetRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountGateway: AccountGateway,
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.get(rideId)
    if (!ride) throw new Error('Ride not found')
    const passenger = await this.accountGateway.getById(ride.passengerId)
    if (!passenger) throw new Error('Passenger not found')
    const driver = async () => {
      const driverId = ride.getDriverId()
      const result = driverId
        ? await this.accountGateway.getById(driverId)
        : null
      return result
    }
    return {
      passengerId: ride.passengerId,
      driverId: ride.getDriverId(),
      rideId: ride.rideId,
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      status: ride.getStatus(),
      lastLat: ride.getLastLat(),
      lastLong: ride.getLastLong(),
      distance: ride.getDistance(),
      fare: ride.getFare(),
      date: ride.date,
      passengerName: passenger.name,
      driverName: driver.name ?? driver.name,
    }
  }
}

interface Output {
  passengerId: string
  driverId?: string
  rideId: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
  status: string
  lastLat: number
  lastLong: number
  distance: number
  fare: number
  date: Date
  passengerName: string
  driverName?: string
}

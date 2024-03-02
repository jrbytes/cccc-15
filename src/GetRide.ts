import type RideRepository from './RideRepository'

export default class GetRide {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.get(rideId)
    if (!ride) throw new Error('Ride not found')
    return ride
  }
}

interface Output {
  passengerId: string
  rideId: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
  status: string
  date: Date
}

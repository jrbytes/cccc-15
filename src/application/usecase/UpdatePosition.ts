import type RideRepository from '../../infra/repository/RideRepository'

export default class UpdatePosition {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId)
    if (!ride) throw new Error('Ride not found')
    ride.updatePosition(input.lat, input.long)
    await this.rideRepository.update(ride)
    // const position = new Position(input.rideId, input.lat, input.long)
    // await this.positionRepository.save(position)
  }
}

interface Input {
  rideId: string
  lat: number
  long: number
}

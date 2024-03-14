import type DomainEvent from '../../domain/event/DomainEvent'
import type Mediator from '../../infra/mediator/Mediator'
import type Queue from '../../infra/queue/Queue'
import type RideRepository from '../../infra/repository/RideRepository'

export default class FinishRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly mediator: Mediator,
    readonly queue: Queue,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.get(input.rideId)
    if (!ride) throw new Error('Ride not found')
    ride.register('rideCompleted', async (event: DomainEvent) => {
      await this.rideRepository.update(ride)
      await this.queue.publish(event.name, event)
    })
    ride.finish()
  }
}

interface Input {
  rideId: string
}

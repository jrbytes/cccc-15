import { v4 } from 'uuid';
import AccountDAO from './AccountDAO';
import RideDAO from './RideDAO';

export default class RequestRide {
  constructor(readonly rideDAO: RideDAO, readonly accountDAO: AccountDAO) {}

  async execute (input: Input): Promise<Output> {
    const ride = Object.assign({
      rideId: v4(),
      status: 'requested',
      date: new Date()
    }, input)
    const account = await this.accountDAO.getById(input.passengerId)
    if (!account.is_passenger) throw new Error('Account is not from a passenger')
    const [activeRide] = await this.rideDAO.getActiveRidesByPassengerId(input.passengerId)
    if (activeRide) throw new Error('Passenger has an active ride')
    await this.rideDAO.save(ride)
    return { rideId: ride.rideId }
  }
}

type Input = {
  passengerId: string
  fromLat: string
  fromLong: string
  toLat: string
  toLong: string
}

type Output = {
  rideId: string
}
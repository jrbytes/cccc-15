import Ride from '../../domain/Ride'
import type DatabaseConnection from '../database/DatabaseConnection'

export default interface RideRepository {
  save: (ride: Ride) => Promise<void>
  get: (rideId: string) => Promise<Ride | undefined>
  getActiveRidesByPassengerId: (passengerId: string) => Promise<Ride[]>
}

interface RideInput {
  ride_id: string
  passenger_id: string
  from_lat: number
  from_long: number
  to_lat: number
  to_long: number
  status: string
  date: Date
}

export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(ride: Ride) {
    await this.connection.query(
      'INSERT INTO cccat15.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.status,
        ride.date,
      ],
    )
  }

  async get(rideId: string): Promise<Ride | undefined> {
    const [ride]: [RideInput] = await this.connection.query(
      'SELECT * FROM cccat15.ride where ride_id = $1',
      [rideId],
    )
    if (!ride) return
    return Ride.restore(
      ride.ride_id,
      ride.passenger_id,
      Number(ride.from_lat),
      Number(ride.from_long),
      Number(ride.to_lat),
      Number(ride.to_long),
      ride.status,
      ride.date,
    )
  }

  async getActiveRidesByPassengerId(passengerId: string): Promise<any> {
    const activeRidesData: RideInput[] = await this.connection.query(
      "SELECT * FROM cccat15.ride WHERE passenger_id = $1 AND status = 'requested'",
      [passengerId],
    )
    const activeRides: Ride[] = []
    for (const activeRideData of activeRidesData) {
      activeRides.push(
        Ride.restore(
          activeRideData.ride_id,
          activeRideData.passenger_id,
          Number(activeRideData.from_lat),
          Number(activeRideData.from_long),
          Number(activeRideData.to_lat),
          Number(activeRideData.to_long),
          activeRideData.status,
          activeRideData.date,
        ),
      )
    }
    return activeRides
  }
}

import Ride from '../../domain/Ride'
import type DatabaseConnection from '../database/DatabaseConnection'

export default interface RideRepository {
  save: (ride: Ride) => Promise<void>
  get: (rideId: string) => Promise<Ride | undefined>
  getActiveRidesByPassengerId: (passengerId: string) => Promise<Ride[]>
  update: (ride: Ride) => Promise<void>
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
  last_lat?: number
  last_long?: number
  distance?: number
  fare?: number
  driver_id?: string
}

export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(ride: Ride) {
    await this.connection.query(
      'INSERT INTO cccat15.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date, last_lat, last_long, distance, fare) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      [
        ride.rideId,
        ride.passengerId,
        ride.getFromLat(),
        ride.getFromLong(),
        ride.getToLat(),
        ride.getToLong(),
        ride.getStatus(),
        ride.date,
        ride.getLastLat(),
        ride.getLastLong(),
        ride.getDistance(),
        ride.getFare(),
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
      Number(ride.last_lat),
      Number(ride.last_long),
      Number(ride.distance),
      Number(ride.fare),
      ride.driver_id,
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
          Number(activeRideData.last_lat),
          Number(activeRideData.last_long),
          Number(activeRideData.distance),
          Number(activeRideData.fare),
          activeRideData.driver_id,
        ),
      )
    }
    return activeRides
  }

  async update(ride: Ride) {
    await this.connection.query(
      'UPDATE cccat15.ride SET status = $1, driver_id = $2, last_lat = $3, last_long = $4, distance = $5, fare = $6 WHERE ride_id = $7',
      [
        ride.getStatus(),
        ride.getDriverId(),
        ride.getLastLat(),
        ride.getLastLong(),
        ride.getDistance(),
        ride.getFare(),
        ride.rideId,
      ],
    )
  }
}

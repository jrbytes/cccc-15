import pgp from "pg-promise";

export default interface RideDAO {
  save (ride: any): Promise<void>;
  get (rideId: string): Promise<any>;
  getActiveRidesByPassengerId (passengerId: string): Promise<any>;
}

export class RideDAODatabase implements RideDAO {
  async save(ride: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/cccat15");
    await connection.query("INSERT INTO cccat15.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
    [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.status, ride.date])
    await connection.$pool.end();
  }
  async get(rideId: string): Promise<any> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/cccat15");
    const [ride] = await connection.query("SELECT * FROM cccat15.ride where ride_id = $1", [rideId])
    await connection.$pool.end();
    return ride
  }
  async getActiveRidesByPassengerId(passengerId: string): Promise<any> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/cccat15");
    const activeRides = await connection.query("SELECT * FROM cccat15.ride WHERE passenger_id = $1 AND status = 'requested'", [passengerId])
    await connection.$pool.end();
    return activeRides
  }
}

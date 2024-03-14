import type DatabaseConnection from '../../infra/database/DatabaseConnection'

export default class GetRideQuery {
  constructor(readonly connection: DatabaseConnection) {}

  async execute(rideId: string) {
    const data = await this.connection.query(
      `
      SELECT
        r.ride_id,
        r.status,
        r.date,
        r.fare,
        r.distance,
        p.name as passenger_name,
        p.email as passenger_email,
        d.name as driver_name,
        d.email as driver_email
      FROM
        cccat15.ride r
        JOIN cccat15.account p ON (r.passenger_id = p.account_id)
        LEFT JOIN cccat15.account d ON (r.driver_id = d.account_id)
      WHERE
        r.ride_id = $1
    `,
      [rideId],
    )
    return data
  }
}

import type DatabaseConnection from '../../infra/database/DatabaseConnection'

export default class GetRideProjectionQuery {
  constructor(readonly connection: DatabaseConnection) {}

  async execute(rideId: string) {
    const [data] = await this.connection.query(
      `
      SELECT * FROM cccat15.ride_projection WHERE ride_id = $1
    `,
      [rideId],
    )
    return data
  }
}

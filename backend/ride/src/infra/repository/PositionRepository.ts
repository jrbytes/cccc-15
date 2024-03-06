import Position from '../../domain/Position'
import type DatabaseConnection from '../database/DatabaseConnection'

export default interface PositionRepository {
  save: (position: Position) => Promise<void>
  listByRideId: (rideId: string) => Promise<Position[]>
}

export class PositionRepositoryDatabase implements PositionRepository {
  constructor(readonly connection: DatabaseConnection) {}

  save = async (position: Position): Promise<void> => {
    await this.connection.query(
      'INSERT INTO cccat15.position (position_id, ride_id, lat, long, date) VALUES ($1, $2, $3, $4, $5)',
      [
        position.positionId,
        position.rideId,
        position.getLat(),
        position.getLong(),
        position.date,
      ],
    )
  }

  async listByRideId(rideId: string): Promise<Position[]> {
    const positionsData = await this.connection.query(
      'SELECT * FROM cccat15.position WHERE ride_id = $1',
      [rideId],
    )
    const positions: Position[] = []
    for (const positionData of positionsData) {
      positions.push(
        new Position(
          String(positionData.position_id),
          String(positionData.ride_id),
          Number(positionData.lat),
          Number(positionData.long),
          positionData.date as Date,
        ),
      )
    }
    return positions
  }
}

import { v4 } from 'uuid'

import Coord from './Coord'

export default class Position {
  private readonly coord: Coord

  constructor(
    readonly positionId: string,
    readonly rideId: string,
    lat: number,
    long: number,
    readonly date: Date,
  ) {
    this.coord = new Coord(lat, long)
    this.date = new Date()
  }

  static create(rideId: string, lat: number, long: number): Position {
    const positionId = v4()
    const date = new Date()
    return new Position(positionId, rideId, lat, long, date)
  }

  getLat = (): number => this.coord.getLat()

  getLong = (): number => this.coord.getLong()
}

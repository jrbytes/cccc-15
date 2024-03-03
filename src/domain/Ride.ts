import { v4 } from 'uuid'

import Coord from './Coord'

export default class Ride {
  private readonly from: Coord
  private readonly to: Coord

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    private status: string,
    readonly date: Date,
    private driverId?: string,
  ) {
    this.from = new Coord(fromLat, fromLong)
    this.to = new Coord(toLat, toLong)
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ) {
    const rideId = v4()
    const status = 'requested'
    const date = new Date()
    return new Ride(
      rideId,
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong,
      status,
      date,
    )
  }

  static restore(
    rideId: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    date: Date,
    driverId?: string,
  ) {
    return new Ride(
      rideId,
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong,
      status,
      date,
      driverId,
    )
  }

  accept(driverId: string) {
    if (this.status !== 'requested') {
      throw new Error('Invalid status')
    }
    this.status = 'accepted'
    this.driverId = driverId
  }

  start() {
    if (this.status !== 'accepted') {
      throw new Error('Invalid status')
    }
    this.status = 'in_progress'
  }

  getStatus() {
    return this.status
  }

  getDriverId() {
    return this.driverId
  }

  getFromLat() {
    return this.from.getLat()
  }

  getFromLong() {
    return this.from.getLong()
  }

  getToLat() {
    return this.to.getLat()
  }

  getToLong() {
    return this.to.getLong()
  }
}

import RideDAO from "./RideDAO";

export default class GetRide {
  constructor(readonly rideDAO: RideDAO) {}

  async execute(rideId: string): Promise<any> {
    const ride = await this.rideDAO.get(rideId);
    return ride;
  }
}

type Output = {
  passengerId: string
  rideId: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
  status: string
  date: Date
}

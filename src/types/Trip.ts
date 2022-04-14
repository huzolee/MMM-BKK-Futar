export interface ITrip {
  id: string;
  routeId: string;
  tripHeadsign: string;
}

interface Trip extends ITrip {}

export default Trip;

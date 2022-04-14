export interface IStopTime {
  stopHeadsign: string;
  departureTime?: Date;
  predictedDepartureTime?: Date;
  tripId: string;
}

interface StopTime extends IStopTime {}

export default StopTime;

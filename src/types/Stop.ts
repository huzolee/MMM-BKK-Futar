export interface IStop {
  id: string;
  name: string;
  routeIds: string[];
}

interface Stop extends IStop {}

export default Stop;

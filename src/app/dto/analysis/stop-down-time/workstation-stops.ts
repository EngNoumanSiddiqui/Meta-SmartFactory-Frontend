import {StopPercentage} from './stop-percentage';

export interface WorkstationStops {

  today: Array<StopPercentage>;
  yesterday: Array<StopPercentage>;
  thisWeek: Array<StopPercentage>;
  lastWeek: Array<StopPercentage>;
  thisMonth: Array<StopPercentage>;
  lastMonth: Array<StopPercentage>;

}

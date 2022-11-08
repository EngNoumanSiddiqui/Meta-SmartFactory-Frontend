export interface StopPercentage {
  stopCause: string;
  actualCost: number;
  planned?: boolean;
  currency: string;
  stopDuration: number;
  stopDurationAsMinutes: number;
  stopPercent: number;
  color: string;
}

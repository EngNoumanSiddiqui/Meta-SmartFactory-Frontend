class duration {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export class ManualJobOrderDto {
  manualJobOrderId: string;
  workStation?: string;
  quantity?: number;
  plannedTime?: duration;
  maxStandbyTime?: duration;
  description?: string;
}

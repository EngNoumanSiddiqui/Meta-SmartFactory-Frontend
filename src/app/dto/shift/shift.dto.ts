/**
 * Created by reis on 19.11.2018.
 */
export class ShiftSettingsResponseDto {
  shiftId: number;
  description: string;
  endTime: any;
  plant: any;
  plantId: number;
  shiftName: string;
  shiftNo: string;
  shiftOrderNo: number;
  startTime: any;
  maxChangeOverCount: number;
}
export class ShiftSettingsRequestDto {
  description: string;
  endTime: Date;
  shiftName: string;
  plantId: number;
  shiftOrderNo: number;
  shiftNo: string;
  startTime: Date;
  maxChangeOverCount: number;
  scheduleSimulationId: number;
  shiftId: number;
}

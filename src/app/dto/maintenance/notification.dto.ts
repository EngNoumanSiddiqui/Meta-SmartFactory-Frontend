export class NotificationRequestDto {
  breakdown: boolean = false;
  breakdownDuration: number;
  equipmentABCIndicatorId: string;
  equipmentId: string;
  equipmentPlannerGroupId: string;
  equipmentPlannerGroup: any;
  mainPlantId: string;
  maintenanceFunctionalLocationId: string;
  maintenanceNotificationId: string;
  maintenanceNotificationType: string = null;
  malfunctionEnd: any;
  malfunctionStart: any;
  notificationNo: string;
  notificationStatus = 'OUTSTANDING';
  priority: string = null;
  problemDefination: string;
  reportedbyId: number;
  reportedby: any;
  requiredEnd: any;
  requiredStart: any;
  responsebyId: number;
  responseby: any;
  workStationId: string;
  cancelReason: string;
}

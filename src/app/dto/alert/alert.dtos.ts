/**
 * Created by reis on 1.11.2018.
 */
export interface AlertSubjectList {
  active: boolean;
  alertMessageSubjectId: number;
  name: string;
}
export class AlertMessageMailList {
  alertEmployeeId: number;
  alertMessageSubjectId: number;
  eMail: string;
}


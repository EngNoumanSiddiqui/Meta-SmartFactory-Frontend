export class MilestoneDto {
    actualFinishDate: Date = null;
    actualStartDate: Date = null;
    code: string = null;
    description: string = null;
    finishDate: Date = null;
    fromERP: boolean = false;
    integrationUpdateDate: Date = null;
    milestoneId: number = null;
    name: string = null;
    projectId: number = null;
    responsibleEmployeeId: number = null;
    responsibleEmployee: any = null;
    scheduledFinishDate: Date = null;
    scheduledStartDate: Date = null;
    startDate: Date = null;
    status: string = null;
}


export class ProjectTaskDto {
    duration: number;
    finishDate: Date;
    fromERP: boolean;
    maxValue: number;
    mileStoneId: number;
    mileStoneNo: string;
    milestoneTaskId: number;
    minValue: number;
    plantId: number;
    project: any = null;
    projectId: number;
    projectNo: string;
    startDate: Date;
    taskCode: string;
    workCenter: any = null;
    workCenterId: number;
    workCenterName: string;
    workCenterNo: string;
}


export class ProjectRequestObject {
    actualFinishDate: Date = null;
    actualStartDate: Date = null ;
    code: string = null ;
    description: string = null ;
    finishDate: Date = null ;
    fromERP: boolean = null ;
    integrationUpdateDate: Date = null ;
    milestoneDtoList: MilestoneDto[] = [] ;
    name: string = null ;
    plantId: number = null ;
    projectId: number = null ;
    responsibleEmployeeId: number = null ;
    responsibleEmployee?: any;
    scheduledFinishDate: Date = null ;
    scheduledStartDate: Date = null ;
    startDate: Date = null ;
    status: string = null ;
}

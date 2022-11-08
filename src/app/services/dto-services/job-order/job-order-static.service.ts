import { Injectable } from "@angular/core";
import { JobOrderStatusEnum } from "app/dto/job-order/job-order.model";
import { DialogTypeEnum } from "app/services/shared/dialog-types.enum";
import { LoaderService } from "app/services/shared/loader.service";
import { UtilitiesService } from "app/services/utilities.service";
import { Subject } from "rxjs";
import { JobOrderService } from "./job-order.service";
import { ServiceLocator } from "./service-location.service";

@Injectable()
export class JobOrderServiceStatic {
    public static jobsrv;
    public static loadingsrv;
    public static utilitiessrv;
    public static divideObs = new Subject();
    public static cancelObs = new Subject();
    public static showRelationsObs = new Subject();
    public static hideRelationsObs = new Subject();
    public static cloneObs = new Subject();
    public static jobOrderChangeStatusObs = new Subject();
    public static planJobOrderManuallyObs = new Subject();
    constructor() {}

    public static lock(jobOrderId) {
        this.jobsrv = ServiceLocator.injector.get(JobOrderService);
        this.loadingsrv = ServiceLocator.injector.get(LoaderService);
        this.utilitiessrv = ServiceLocator.injector.get(UtilitiesService);
        this.loadingsrv.showLoader();
        this.jobsrv.lockJobOrder(jobOrderId).then(() => {
            this.loadingsrv.hideLoader();
            this.utilitiessrv.showSuccessToast('Task is Locked');
            
        }, err => {
            this.loadingsrv.hideLoader();
            this.utilitiessrv.showErrorToast(err)
        });
    }
    public static unlock(jobOrderId) {
        this.jobsrv = ServiceLocator.injector.get(JobOrderService);
        this.loadingsrv = ServiceLocator.injector.get(LoaderService);
        this.utilitiessrv = ServiceLocator.injector.get(UtilitiesService);
        this.loadingsrv.showLoader();
        this.jobsrv.unLockJobOrder(jobOrderId).then(() => {
            this.loadingsrv.hideLoader();
            this.utilitiessrv.showSuccessToast('Task is UnLocked');
            
        }, err => {
            this.loadingsrv.hideLoader();
            this.utilitiessrv.showErrorToast(err)
        });
    }
    public static jobOrderChangeStatus(eventRecord) {
        this.jobOrderChangeStatusObs.next(eventRecord);
    }

    public static planJobOrderManually(eventRecord) {
        this.planJobOrderManuallyObs.next(eventRecord);
    }

    public static showJobOrderDetails(jobOrderId) {
        this.loadingsrv = ServiceLocator.injector.get(LoaderService);
        this.loadingsrv.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
    }
   
    
    public static divideTask(jobOrderId) {
        this.jobsrv = ServiceLocator.injector.get(JobOrderService);
        this.loadingsrv = ServiceLocator.injector.get(LoaderService);
        this.utilitiessrv = ServiceLocator.injector.get(UtilitiesService);
        this.loadingsrv.showLoader();
        this.jobsrv.getDetail(jobOrderId).then((jobOrder) => {
            this.loadingsrv.hideLoader();
            // this.utilitiessrv.showSuccessToast('Task is UnLocked');
            this.divideObs.next(jobOrder);
        }, err => {
            this.loadingsrv.hideLoader();
            this.utilitiessrv.showErrorToast(err)
        });
        
    }
    public static changeToReady(eventRecord) {
        this.jobsrv = ServiceLocator.injector.get(JobOrderService);
        this.loadingsrv = ServiceLocator.injector.get(LoaderService);
        this.utilitiessrv = ServiceLocator.injector.get(UtilitiesService);
        this.loadingsrv.showLoader();
        this.jobsrv.changeJobOrderStatusToReady(eventRecord.jobOrderId).then((jobOrder) => {
            this.loadingsrv.hideLoader();
            this.utilitiessrv.showSuccessToast('job-order-changed-to-ready');
            eventRecord.status = JobOrderStatusEnum.READY;
            
        }, err => {
            this.loadingsrv.hideLoader();
            this.utilitiessrv.showErrorToast(err)
        });
        
    }

    public static cancelTask(eventRecord) {
        this.jobsrv = ServiceLocator.injector.get(JobOrderService);
        this.loadingsrv = ServiceLocator.injector.get(LoaderService);
        this.utilitiessrv = ServiceLocator.injector.get(UtilitiesService);
        this.loadingsrv.showLoader();
        this.jobsrv.cancelJobOrder(eventRecord.jobOrderId).then((jobOrder) => {
            this.loadingsrv.hideLoader();
            this.utilitiessrv.showSuccessToast('job-order-canceled');
            this.cancelObs.next('cancel-job-order');
            eventRecord.status = JobOrderStatusEnum.CANCELLED;
        }, err => {
            this.loadingsrv.hideLoader();
            this.utilitiessrv.showErrorToast(err)
        });
        
    }


    public static showRelations(prodOrderId) {
        this.jobsrv = ServiceLocator.injector.get(JobOrderService);
        this.loadingsrv = ServiceLocator.injector.get(LoaderService);
        this.utilitiessrv = ServiceLocator.injector.get(UtilitiesService);
        this.loadingsrv.showLoader();
        this.jobsrv.getProdDetail(prodOrderId).then((prodOrder) => {
            this.loadingsrv.hideLoader();
            this.showRelationsObs.next(prodOrder);
        }, err => {
            this.loadingsrv.hideLoader();
            this.utilitiessrv.showErrorToast(err)
        });
        
    }
    public static hideRelations(event) {
        this.hideRelationsObs.next(event);
    }
    public static cloneTask(orderEvent) {
        this.cloneObs.next(orderEvent);
    }

    public static getDivideObs() {
        return this.divideObs.asObservable();
    }
    public static getjobOrderChangeStatusObs() {
        return this.jobOrderChangeStatusObs.asObservable();
    }


    public static getPlanJobOrderManually() {
        return this.planJobOrderManuallyObs.asObservable();
    }

    public static getCloneObs() {
        return this.cloneObs.asObservable();
    }


    
}
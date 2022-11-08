import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable()
export class ProjectStaticService {
    
    public static jobOrderChangeStatusObs = new Subject();
    public static filterByObs = new BehaviorSubject({name: null, value: null});
    public static navigateToDateObs = new Subject();
    public static exportPDFObs = new Subject();
    public static exportExcelObs = new Subject();
    constructor(){}


    public static jobOrderChangeStatus(eventRecord) {
        this.jobOrderChangeStatusObs.next(eventRecord);
    }

    public static getjobOrderChangeStatusObs() {
        return this.jobOrderChangeStatusObs.asObservable();
    }
    public static filterBy(eventRecord) {
        this.filterByObs.next(eventRecord);
    }
    

    public static getfilterByObs() {
        return this.filterByObs.asObservable();
    }
    public static navigateToDate(eventRecord) {
        this.navigateToDateObs.next(eventRecord);
    }
    public static getNavigateToDateObs() {
        return this.navigateToDateObs.asObservable();
    }

    public static exportPDF() {
        this.exportPDFObs.next();
    }

    public static getexportPDFObs() {
        return this.exportPDFObs.asObservable();
    }
    public static exportExcel() {
        this.exportExcelObs.next();
    }

    public static getexportExcelObs() {
        return this.exportExcelObs.asObservable();
    }

    ngOnDestroy() {
        ProjectStaticService.jobOrderChangeStatusObs?.unsubscribe();
        ProjectStaticService.filterByObs?.unsubscribe();
        ProjectStaticService.navigateToDateObs?.unsubscribe();
        ProjectStaticService.exportPDFObs?.unsubscribe();
        ProjectStaticService.exportExcelObs?.unsubscribe();
    }
}

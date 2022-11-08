import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/shared/loader.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ConvertUtil } from 'app/util/convert-util';
import { Subscription } from 'rxjs';
import { SkillMatrixReportService } from 'app/services/dto-services/skill-matrix-report/skill-matrix-report.service';

@Component({
    templateUrl: './skill-matrix-report.html',
    //   styleUrls: ['./oee.scss']
})
export class SkillMatrixReportComponent implements OnInit, OnDestroy {

    plantId: any;

    filterCon = {
        finishDate: null,
        group: null,
        startDate: null,
        skillType: null,
        plantId: null
    }

    filterEmployeeCon = {
        employeeId: null,
        finishDate: null,
        firstName: null,
        group: null,
        lastName: null,
        orderByDirection: 'desc',
        orderByProperty: 'skillMatrixCategoryId',
        pageNumber: 1,
        pageSize: 1000000,
        plantId: null,
        query: null,
        skillMatrixCategoryId: null,
        skillMatrixCategoryName: null,
        startDate: null
    };

    filterWorkstationCon = {
        finishDate: null,
        group: null,
        orderByDirection: 'desc',
        orderByProperty: 'skillMatrixCategoryId',
        pageNumber: 1,
        pageSize: 100000,
        query: null,
        skillMatrixCategoryId: null,
        skillMatrixCategoryName: null,
        startDate: null,
        workStationId: null,
        workStationName: null,
        plantId: null
    }

    skillMatrixSamplingFilter = {
        groupType: null,
        orderByDirection: null,
        orderByProperty: null,
        pageNumber: 1,
        pageSize: 9999990,
        query: null,
        skillMatrixSamplingValueId: null
    }

    skillMatrixGroupTypes = [];

    isLoading: boolean = false;

    filterData: any;

    sub: Subscription;

    skillType: string = null;

    tempFilter: any;

    skillMatrixValues = [];

    constructor(
        private _loaderSvc: LoaderService,
        private _appStateSvc: AppStateService,
        private _enumSvc: EnumService,
        private _skillMatrixReportSvc: SkillMatrixReportService
    ) {
        this.sub = this._appStateSvc.plantAnnounced$.subscribe(res => {
            if (!res) {
                this.plantId = null;
                this.filterCon.plantId = null;
            } else {
                this.plantId = res.plantId;
                this.filterCon.plantId = this.plantId;
            }
            this.analyze();
        });
    }


    ngOnInit(): void {
        this._enumSvc.getSkillMatrixGroupTypeEnum().then(res => this.skillMatrixGroupTypes = res);
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    analyze() {
        this.filterData = [];
        const temp = Object.assign({}, this.filterCon);

        if (temp.startDate) {
            temp.startDate = ConvertUtil.date2StartOfDay(temp.startDate);
            temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
        } if (temp.finishDate) {
            temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
            temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
        }
        this.tempFilter = Object.assign({}, temp);
        this.skillMatrixSamplingFilter.groupType = this.tempFilter.group;

        // this._skillMatrixSamplingValueSvc.filter(this.skillMatrixSamplingFilter).then(res=> {
        //     console.log('@_skillMatrixSamplingValueSvc', res)
        // })
        if (temp.skillType === 'EMPLOYEE') {
            this.filterEmployeeCon.group = temp.group;
            this.filterEmployeeCon.startDate = temp.startDate;
            this.filterEmployeeCon.finishDate = temp.finishDate;
            this.filterEmployeeCon.plantId = temp.plantId;
            // this.getEmployeeSkillMatrix(this.filterEmployeeCon);
        } else if (temp.skillType === 'WORKSTATION') {
            this.filterWorkstationCon.group = temp.group;
            this.filterWorkstationCon.startDate = temp.startDate;
            this.filterWorkstationCon.finishDate = temp.finishDate;
            this.filterWorkstationCon.plantId = temp.plantId;
            // this.getWorkstationSkillMatrix(this.filterWorkstationCon);
        }


        if(temp.group=== 'MURI' && temp.skillType === 'EMPLOYEE' ){
            this.getSkillMatrixCategoryForEmployeeMuri(this.filterEmployeeCon);
        }else if(temp.group=== 'MURI' && temp.skillType === 'WORKSTATION'){
            this.getSkillMatrixCategoryForWorkStationMuriChart(this.filterWorkstationCon);
        }else if(temp.group=== 'MUDA' && temp.skillType === 'EMPLOYEE' ){
            this.getSkillMatrixCategoryForEmployeeMuda(this.filterEmployeeCon);
        }else if(temp.group=== 'MUDA' && temp.skillType === 'WORKSTATION' ){
            this.getSkillMatrixCategoryForWorkStationMuda(this.filterWorkstationCon);
        }

    }

    getSkillMatrixCategoryForWorkStationMuriChart(filter){
        this._loaderSvc.showLoader();
        this._skillMatrixReportSvc.getSkillMatrixCategoryForWorkStationMuriChart(filter).then(res => {
            this.filterData = [...res['content']];
            this.hideLoader();
        });
    }

    getSkillMatrixCategoryForEmployeeMuri(filter){
        this._loaderSvc.showLoader();
        this._skillMatrixReportSvc.getSkillMatrixCategoryForEmployeeMuri(filter).then(res => {
            this.filterData = [...res['content']];
            this.hideLoader();
        });
    }


    getSkillMatrixCategoryForWorkStationMuda(filter){
        this._loaderSvc.showLoader();
        this._skillMatrixReportSvc.getSkillMatrixCategoryForWorkStationMuda(filter).then(res => {
            this.filterData = [...res['content']];
            this._loaderSvc.hideLoader();

        });
    }

    getSkillMatrixCategoryForEmployeeMuda(filter){
        this._loaderSvc.showLoader();
        this._skillMatrixReportSvc.getSkillMatrixCategoryForEmployeeMuda(filter).then(res => {
            this.filterData = [...res['content']];
            this._loaderSvc.hideLoader();
        });
    }

    hideLoader() {
        if (this.filterData.length == 0) {
            this._loaderSvc.hideLoader();
        }
    }

    onGroupChanged(event) {
        if (event) {
            this.isLoading = false;
            // if(event === 'MURI' || event === 'MUDA') {
            //     this.filterCon.skillType = 'EMPLOYEE';
            // } else {
            //     this.filterCon.skillType = 'WORKSTATION';
            // }
        }
    }
}

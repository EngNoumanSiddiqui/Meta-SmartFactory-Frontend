
import { Component, Input, ViewChild } from '@angular/core';
// import { StockPurchasingInfoRecord } from 'app/dto/stock/stock-card.model';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { QualityControlKeyServiceService } from 'app/services/dto-services/quality-control-key/quality-control-key-service.service';
import { QualitySystemsService } from 'app/services/dto-services/quality-systems/quality-systems.service';

@Component({
    selector: 'quality-screen-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['../../new/new.css']
})
export class QualityScreenEditComponent {

    @ViewChild('qualityModal') public qualityModal: ModalDirective;

    @Input('stock') set st(data) {
        console.log('@qualityScreenStock', data)
        this.stock = JSON.parse(JSON.stringify(data));
    }

    inspectionSetupDto = {
        inspectionType: null,
        inspectionWithTaskList: true,
        postToInspectionStock: true,
        qualityInspectionSetupCode: null,
        qualityInspectionSetupId: null,
        stockQualityId: null,
    }

    stock: any;

    inspectionSetupList = [];

    modal = {
        active: false,
        dialog: null
    }

    inspectionTypes = [];

    controlKeys = [];

    qualitySystems = [];

    selectedInspection: any;

    newInspection: boolean;

    constructor(
        private _enumSvc: EnumService,
        private _qualityControlKeySvc: QualityControlKeyServiceService,
        private _qualitySystemSvc: QualitySystemsService
    ) { }

    ngOnInit() {
        this._enumSvc.getQualityInspectionTypeEnum().then((res: any) => { this.inspectionTypes = res; });
        this._qualityControlKeySvc.filter({ pageNumber: 1, pageSize: 9999 }).then((res: any) => this.controlKeys = res['content']);
        this._qualitySystemSvc.filter({ pageNumber: 1, pageSize: 9999 }).then((res: any) => this.qualitySystems = res['content']);
    }

    inspectionScreenShow() {
        this.modal.active = true;
    }

    showDialogToAdd() {
        this.newInspection = true;
        this.resetInspection();
        this.modal.active = true;
    }

    save() {
        let inspectionSetups = [...this.inspectionSetupList];
        if (this.newInspection)
            inspectionSetups.push(this.inspectionSetupDto);
        else
            inspectionSetups[this.inspectionSetupList.indexOf(this.selectedInspection)] = this.inspectionSetupDto;

        this.inspectionSetupList = inspectionSetups;
        this.resetInspection();
        this.modal.active = false;
    }

    delete(selectedInspection) {
        this.selectedInspection = selectedInspection
        let index = this.inspectionSetupList.indexOf(this.selectedInspection);
        this.inspectionSetupList = this.inspectionSetupList.filter((val, i) => i != index);
        this.resetInspection();
        this.modal.active = false;
    }

    onRowSelect(inspection) {
        this.newInspection = false;
        this.selectedInspection = inspection;
        this.inspectionSetupDto = this.cloneInspection(inspection);
        this.modal.active = true;

    }

    cloneInspection(c: any): any {
        let inspection = {};
        for (let prop in c) {
            inspection[prop] = c[prop];
        }
        return inspection;
    }

    resetInspection() {
        this.inspectionSetupDto = {
            inspectionType: null,
            inspectionWithTaskList: true,
            postToInspectionStock: true,
            qualityInspectionSetupCode: null,
            qualityInspectionSetupId: null,
            stockQualityId: null,
        }
    }

}

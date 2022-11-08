import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { ParityService } from 'app/services/dto-services/parity/parity.service';
import { InvoiceService } from 'app/services/dto-services/invoice/invoice.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

@Component({
  selector: 'invoice-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  payLoadObject = {
    actualAmount: null,
    createDate: null,
    createdById: null,
    invoiceId: null,
    invoiceNo: null,
    invoiceType: null,
    notes: null,
    organizationId: null,
    plantId: null,
    postingDate: null,
    referenceId: null,
    updateDate: null,
  }
  plantId: any;

  @Input('plantId') set setplantId(plantId) {
    this.plantId = plantId;
    this.payLoadObject.plantId = plantId;
  }
  @Input('organizationId') set setorganizationId(organizationId) {
    this.payLoadObject.organizationId = organizationId;
  }
  @Input('referenceId') set setreferenceId(referenceId) {
    this.payLoadObject.referenceId = referenceId;
  }
  @Input('invoiceType') set setinvoiceType(invoiceType) {
    this.payLoadObject.invoiceType = invoiceType;
  }
  @Input('actualAmount') set setactualAmount(actualAmount) {
    this.payLoadObject.actualAmount = actualAmount;
  }
  @Input('postingDate') set setpostingDate(postingDate) {
    this.payLoadObject.postingDate = postingDate;
  }
  invoiceTypeList: any;
  constructor( private invoiceService: InvoiceService,
    private loaderService: LoaderService,
    private enumService: EnumService,
    private utilities: UtilitiesService, ) {

  }


  ngOnInit() {

    
    // this.payLoadObject.invoiceType = this.invoiceType;
    // this.payLoadObject.referenceId = this.referenceId;
    // this.payLoadObject.actualAmount = this.actualAmount;
    // this.payLoadObject.postingDate = this.postingDate;

    this.enumService.getInvoiceTypeEnum().then((result: any) => this.invoiceTypeList=result).catch(error => {this.utilities.showErrorToast(error)});
  }


  reset() {
    this. payLoadObject = {
      actualAmount: null,
      createDate: null,
      createdById: null,
      invoiceId: null,
      invoiceNo: null,
      invoiceType: null,
      notes: null,
      organizationId: this.payLoadObject.organizationId,
      plantId: this.payLoadObject.plantId,
      postingDate: null,
      referenceId: null,
      updateDate: null,
    }
  }

  save() {
    this.payLoadObject.plantId = this.plantId;
    // this.payLoadObject.organizationId = this.organizationId;
    this.loaderService.showLoader();
    this.invoiceService.save(this.payLoadObject)
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.reset();
          this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

}

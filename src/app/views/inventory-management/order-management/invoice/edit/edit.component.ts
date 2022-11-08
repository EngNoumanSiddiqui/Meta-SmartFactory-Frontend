import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { InvoiceService } from 'app/services/dto-services/invoice/invoice.service';

@Component({
  selector: 'invoice-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
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
  @Input() plantId = null;
  @Input() organizationId = null;
  invoiceTypeList: any;

  @Input('data') set z(data) {
    if (data) {
      this.payLoadObject = {
        plantId: this.plantId,
        actualAmount: data['actualAmount'],
        createDate: data['createDate'],
        createdById: data['createdById'],
        invoiceId: data['invoiceId'],
        invoiceNo: data['invoiceNo'],
        invoiceType: data['invoiceType'],
        notes: data['notes'],
        organizationId: data['organizationId'],
        postingDate: new Date(data['postingDate']),
        referenceId: data['referenceId'],
        updateDate: data['updateDate'],
      };
    }
  };

  constructor( private invoiceService: InvoiceService,
    private loaderService: LoaderService,
    private enumService: EnumService,
    private utilities: UtilitiesService, ) {

  }

  ngOnInit() {
    this.payLoadObject.plantId = this.plantId;
    this.payLoadObject.organizationId = this.organizationId;
    this.enumService.getInvoiceTypeEnum().then((result: any) => this.invoiceTypeList=result).catch(error => {this.utilities.showErrorToast(error)});
  }

  save() {
    this.loaderService.showLoader();
    this.payLoadObject.plantId = this.plantId;
    this.invoiceService.save(this.payLoadObject)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });

  }
  reset() {}

}

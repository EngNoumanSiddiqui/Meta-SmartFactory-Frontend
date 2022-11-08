import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {BatchService} from '../../../services/dto-services/batch/batch.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'batch-auto-complete',
  templateUrl: './batch-auto-complete.component.html',

})

export class BatchAutoCompleteComponent implements OnInit {

  @Output() selectedBatchEvent = new EventEmitter<any>();
  selectedBatch;
  @Input() required: boolean;
  @Input() dropdown = true;
  RequestBatchDto = {
    actId: null,
    batchLevel: null,
    plantId: null,
    requestedBy: null,
    stockId: null
  };
  selectedPlant: any;
  @Input('selectedBatchCode')
  set in(selectedBatchCode) {
    if (selectedBatchCode) {
      this.selectedBatch = {batchCode: selectedBatchCode};
    } else {
      this.selectedBatch = null;
    }
  }

  @Input('plantId')  set a(plantId) {
    this.batchFilter.plantId = plantId;
    // this.filteredBatch = null;
    // this.allBatchs = null;
    this.RequestBatchDto.plantId = plantId;
    // this.searchTerms.next(this.batchFilter);
  }

  @Input('stockId')  set s(stockId) {
    this.batchFilter.stockId = stockId;
    // this.filteredBatch = null;
    // this.allBatchs = null;
    this.RequestBatchDto.stockId = stockId;
    this.searchTerms.next(this.batchFilter);
  }

  @Input('actId')  set sact(actId) {
    if (actId) {
      this.RequestBatchDto.actId = actId;
    }
  }
  @Input('batchLevel')  set sbatch(batchLevel) {
    if (batchLevel) {
      this.RequestBatchDto.batchLevel = batchLevel;
    }
  }
  @Input('requestedBy')  set reqestby(requestedBy) {
    if (requestedBy) {
      this.RequestBatchDto.requestedBy = requestedBy;
    } else {
      this.RequestBatchDto.requestedBy = null;
    }
  }

  PORData: any;
  @Input('PORData') set z(PORData) {
    if (PORData) {
      this.PORData = PORData;
    }
  }
  // @Input('newBatchData') set newz(newBatchDt) {
  //   if (newBatchDt) {
  //     this.RequestBatchDto = {
  //       actId: newBatchDt.actId,
  //       actType: newBatchDt.actType,
  //       availableFrom: newBatchDt.availableFrom,
  //       batchCode: newBatchDt.batchCode,
  //       batchId: newBatchDt.batchId,
  //       batchLevel: newBatchDt.batchLevel,
  //       countryId: newBatchDt.countryId,
  //       createDate: newBatchDt.createDate,
  //       lastGoodsReceipt: newBatchDt.lastGoodsReceipt,
  //       manufactureDate: newBatchDt.manufactureDate,
  //       note: newBatchDt.note,
  //       plantId: newBatchDt.plantId,
  //       requestedBy: newBatchDt.requestedBy,
  //       sledBbdDate: newBatchDt.sledBbdDate,
  //       stockId: newBatchDt.stockId,
  //       vendor: newBatchDt.vendor,
  //       vendorBatch: newBatchDt.vendorBatch
  //     }
  //   }
  // }

  placeholder = 'no-data';
  filteredBatch: Array<any>;

  batchFilter = {
    batchCode: null,
    pageSize: 500,
    plantId: null,
    stockId: null,
    plantName: null,
    pageNumber: 1,
    orderByProperty: 'batchCode'
  };
  @Input() addIfMissing = false;
  @Input() disabled = false;

  @Input() isCombineJobOrder: boolean = false;

  modal = {active: false};

  private allBatchs: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private batchService: BatchService, private loadingService: LoaderService,
    private _userSvc: UsersService,
     private utilities: UtilitiesService) {
      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.batchFilter.plantId = this.selectedPlant.plantId;
      }
  }

  modalShow() {

      if(this.isCombineJobOrder && !this.RequestBatchDto.plantId){
           this.utilities.showInfoToast('provide-plant');
          return;
      }
      else if ((!this.isCombineJobOrder ) && (!this.RequestBatchDto.plantId || !this.RequestBatchDto.stockId)) {
        this.utilities.showInfoToast('provide-plant-stock');
        return;
      } else {
        // this.RequestBatchDto.requestedBy = this.selectedBatch ? (this.selectedBatch.batchId || this.selectedBatch.batchCode) : null;
        // console.log(this.RequestBatchDto);
        this.RequestBatchDto.actId = null; // for time being and will be resolved when backend issue resolved
        this.batchService.autosave(this.RequestBatchDto).then((result) => {
          this.loadingService.hideLoader();
          this.searchTerms.next(this.batchFilter);
          if (result) {
            this.selectedBatch = result;
            this.onChangeBatch(this.selectedBatch);
            this.utilities.showSuccessToast('saved-success');
          } else {
            this.PORData = {
              'plantId': this.RequestBatchDto.plantId,
              'stockId': this.RequestBatchDto.stockId,
              'actId': this.RequestBatchDto.actId,
            };
            this.modal.active = true;
          }


        }).catch(error => {
          this.loadingService.hideLoader();
          this.utilities.showErrorToast(error);
        });
      }
  }
  hasInt(batchCode): string {
    let i = 1;
    const a = batchCode.split(''); let b = '', c = '';
    a.forEach((e) => {
     if (!isNaN(e)) {
      //  console.log(`CONTAIN NUMBER «${e}» AT POSITION ${a.indexOf(e)} => TOTAL COUNT ${i}`)
       c += e
       i++
     } else {b += e}
   })
   console.log(`STRING IS «${b}», NUMBER IS «${c}»`)
   // tslint:disable-next-line: radix
   return b + '' + (parseInt(c) + 1).toString();
  //  if (i === 0) {
  //     return false
  //     // return b
  //  } else {
  //     return true
  //     // return +c
  //  }
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.batchService.filterObservable(this.batchFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.batchFilter);
  }

  private  initResult(res) {
    // this.filteredBatch = res;
    this.allBatchs = res;
    if (res && res.length > 0) {
      this.placeholder = 'search-batch';
    } else {
      this.placeholder = 'no-data';
      this.selectedBatch = null;
      this.onChangeBatch(this.selectedBatch);
    }
  }


  onChangeBatch(event) {
    if (event && event.hasOwnProperty('batchCode')) {
      this.selectedBatchEvent.next(this.selectedBatch);
    } else {
      this.selectedBatchEvent.next(null);
    }
  }

  searchBatch(event) {
    this.filteredBatch = this.filterMatched(event.query);
  }

  handleDropdownClickForBatch() {
    this.filteredBatch = [...this.allBatchs];

    if (this.filteredBatch.length == 0) {
      this.batchFilter.batchCode = null;
      this.searchTerms.next(this.batchFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allBatchs && this.allBatchs.length > 0) {
      for (let i = 0; i < this.allBatchs.length; i++) {
        const obj = this.allBatchs[i];
        if (obj['batchCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.batchFilter.batchCode = query;
      this.searchTerms.next(this.batchFilter);
    }
    return filtered;
  }

  setBatch(batch) {

    if (batch) {
      this.selectedBatch = batch;
      this.allBatchs.push(batch);
      this.handleDropdownClickForBatch()
      this.onChangeBatch(this.selectedBatch);
    }
  }

}

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UtilitiesService} from '../../../services/utilities.service';
import {WorkstationService} from '../../../services/dto-services/workstation/workstation.service';
import {WeightUnit} from '../../../dto/stock/stock-card.model';
import {SharedUnitListService} from './shared-unit-list.service';

@Component({
  selector: 'unit-auto-complete',
  templateUrl: './unit-list.component.html',
})

export class UnitAutoCompleteComponent implements OnInit, OnDestroy {

  unitList;
  disabled = false;
  @Input() required: boolean;
  selectedUnit;

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  @Input() onlyThatValue: any;

  modal = {active: false};

  @Input('selectedUnit') set s(selectedUnit) {
    if (selectedUnit) {
      this.selectedUnit = {unit: selectedUnit};
    } else {
      this.selectedUnit = null;
    }
  }

  weightUnit: WeightUnit = new WeightUnit();
  @Input() addIfMissing = true;

  @Output() unitChangeEvent = new EventEmitter<any>();
  subscription;

  constructor(private workstationService: WorkstationService,
              public sharedUnitList: SharedUnitListService,
              private utilities: UtilitiesService) {

  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.unitList = this.sharedUnitList.getUnitList();

    if (!this.unitList) {
      this.getUnitListAndPublish();
    }
    this.subscription = this.sharedUnitList.subscriber$.subscribe(item => {
      this.unitList = item;
    });

  }

  private getUnitListAndPublish() {
    const me = this;
    this.workstationService.getWorkstationUnitList().then(result => {
      this.unitList = result;
      const myItems = (result as Array<any>).map(obj => ({...obj}));
      me.sharedUnitList.publishNewList(myItems);
    }).catch(error => console.log(error));
  }

  onChangeUnit(event) {
    if (event && event.hasOwnProperty('unit')) {
      if (this.onlyThatValue) {
        if (this.onlyThatValue === event.unit) {
          this.unitChangeEvent.next(event.unit);
        } else {
          setTimeout(() => {
            this.selectedUnit = null;
          }, 400); 
        }
      } else {
        this.unitChangeEvent.next(event.unit);
      }
    } else {
      this.unitChangeEvent.next(null);
    }
  }

  modalShow() {
    this.modal.active = true;
  }

  addWeightUnit() {
    this.workstationService.saveWorkstarionUnit(this.weightUnit).then(result => {
      this.utilities.showSuccessToast('saved-success');
      this.getUnitListAndPublish();
      this.selectedUnit = Object.assign({}, this.weightUnit);
      this.onChangeUnit(this.selectedUnit);
    })
      .catch(error => this.utilities.showErrorToast(error));
  }

  resetWeightUnit() {
    this.weightUnit.unit = null;
    this.weightUnit.dimension = null;
    this.weightUnit.unitDescription = null;
  }

}

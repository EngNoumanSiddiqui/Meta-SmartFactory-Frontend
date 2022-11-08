import { AppStateService } from 'app/services/dto-services/app-state.service';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlantService} from '../../../services/dto-services/plant/plant.service';
import {SharedPlantListService} from './shared-plant-list.service';
import {UtilitiesService} from '../../../services/utilities.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'plant-auto-complete',
  templateUrl: './plant-auto-complete.component.html',

})

export class PlantAutoCompleteComponent implements OnInit, OnDestroy {

  disabled = false;
  @Input() required: boolean;
  selectedPlant;
  selectedPlantId;
  @Input() addIfMissing = false;
  @Input() autoPlantSelected = false;
  sub: Subscription;
  @Input('disabled') set y(disabled) {
    this.disabled = disabled;
  }

  @Input('selectedPlant') set s(selectedPlant) {
    this.selectedPlant = selectedPlant;
  }
  eventFire = false;
  @Input('eventFire') set sdf(eventFire) {
    this.eventFire = eventFire;
    // if (eventFire === true) {
    //   setTimeout(() => {
    //     if (this.selectedPlant) {
    //       this.selectedPlantEvent.next(this.selectedPlant);
    //     }
    //   }, 1000);
    // }
  }
  @Input('selectedPlantId') set sId(selectedPlantId) {
    if (selectedPlantId) {
      this.selectedPlantId = +selectedPlantId;
      this.initResult(this.sharedPlantList.getPlantList());
      if (!this.allPlant) {
        this.getPlantListAndPublish();
      }
    }
  }

  @Input() dropdown = true;
  @Output() selectedPlantEvent = new EventEmitter<any>();
  modal = {active: false};
  private allPlant: Array<any>;
  placeholder = 'no-data';
  filteredPlant: Array<any>;
  subscription;

  constructor(private plantService: PlantService,
              public sharedPlantList: SharedPlantListService,
              private appStateService: AppStateService,
              private utilities: UtilitiesService) {}

  modalShow() {
    this.modal.active = true;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit() {
    this.initResult(this.sharedPlantList.getPlantList());
    if (!this.allPlant) {
      this.getPlantListAndPublish();
    }
    this.subscription = this.sharedPlantList.subscriber$.subscribe(item => {
      this.initResult(item);
    });

    setTimeout(() => {
      this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
        if ((res) && res.plantId && this.eventFire === true) {
          this.selectedPlant = res;
          this.selectedPlantEvent.next(this.selectedPlant);
        }
      });
    }, 500);
  }
  private getPlantListAndPublish() {
    const me = this;
    this.plantService.getAllPlants().then(result => {
      this.initResult(result);
      const myItems = (result as Array<any>).map(obj => ({...obj}));
      me.sharedPlantList.publishNewList(myItems);
    }).catch(error => this.initResult([]));
  }


  private  initResult(res) {
    // this.filteredPlant = res;
    this.allPlant = res;
    if (res && res.length > 0) {
      if (this.selectedPlantId) {
        const slctdplant = (res as Array<any>).find(itm => this.selectedPlantId === itm.plantId);
        this.selectedPlant = slctdplant;
      }
      if (this.selectedPlant) {
        const slctdplant = (res as Array<any>).find(itm => this.selectedPlant.plantId === itm.plantId);
        this.selectedPlant = slctdplant;
      }
      // if (!this.selectedPlantId && !this.selectedPlant && this.autoPlantSelected) {
      //   this.selectedPlant = res[0];
      //   this.onChangePlant(this.selectedPlant);
      // }
      this.placeholder = 'search-plant';
    } else {
      this.placeholder = 'no-data';

    }
  }
  // using eventEmitter
  onChangePlant(event) {
    if (event && event.hasOwnProperty('plantId')) {
      this.selectedPlantEvent.next(this.selectedPlant);
    } else {
      this.selectedPlantEvent.next(null);
    }
  }

  searchPlant(event) {
    this.filteredPlant = this.filterMatched(event.query);
  }

  handleDropdownClickForPlant() {
    this.filteredPlant = [...this.allPlant];
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allPlant && this.allPlant.length > 0) {
      for (let i = 0; i < this.allPlant.length; i++) {
        const obj = this.allPlant[i];
        if (obj['plantName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    return filtered;
  }

  setPlant(plant) {

    if (plant) {
      this.selectedPlant = plant;
      this.allPlant.push(plant);
      const myItems = (this.allPlant as Array<any>).map(obj => ({...obj}));
      this.sharedPlantList.publishNewList(myItems);
      this.handleDropdownClickForPlant()
      this.onChangePlant(this.selectedPlant);
    }
  }
}

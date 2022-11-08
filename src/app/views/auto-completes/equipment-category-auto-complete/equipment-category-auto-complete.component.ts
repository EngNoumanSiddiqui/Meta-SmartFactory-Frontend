import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {EquipmentCategoryService} from '../../../services/dto-services/maintenance-equipment/equipment-category.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'equipment-category-auto-complete',
  templateUrl: './equipment-category-auto-complete.component.html',

})

export class EquipmentCategoryAutoCompleteComponent implements OnInit {

  @Output() selectedCategoryEvent = new EventEmitter();

  selectedCategory;
  disabled = false;
  modal = {active: false};

  @Input() dropdown=true;
  @Input() required: boolean;
  selectedPlant: any;

  @Input('selectedCategory')
  set a(selectedCategory) {
    this.selectedCategory = selectedCategory;
  }

  @Input('selectedCategoryId')
  set b(selectedCategoryId) {
    this.getCategoryDetail(selectedCategoryId);
  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }
  @Input() addIfMissing = false;
  placeholder = 'no-data';
  filteredCategory;
  categoryFilter = {
    equipmentCategory: null,
    pageSize: 1000,
    plantId: null,
    pageNumber: 1,
    orderByProperty: 'equipmentCategory'
  };


  allCategories;
  private searchTerms = new Subject<any>();

  constructor(private categoryService: EquipmentCategoryService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.categoryFilter.plantId = this.selectedPlant.plantId;
    }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.categoryService.filterObservable(this.categoryFilter))).subscribe(
      cats => this.initResult(cats['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.categoryFilter);
  }

  modalShow() {
    this.modal.active = true;
  }

  getCategoryDetail(equipmentCategoryId) {
    if (equipmentCategoryId) {
      this.categoryService.getDetail(equipmentCategoryId).then(rs => {
        this.selectedCategory = rs;
        this.checkAndAddSelectedCategory();
      });
    }

  }

  private checkAndAddSelectedCategory() {
    const me = this;
    if (this.selectedCategory) {
      if (this.filteredCategory) {
        const ex = this.filteredCategory.find(it => it.equipmentCategoryId == me.selectedCategory.equipmentCategoryId);
        const aex = this.allCategories.find(it => it.equipmentCategoryId == me.selectedCategory.equipmentCategoryId);
        if (!aex) {
          this.filteredCategory.push(this.selectedCategory);
          this.filteredCategory = [...this.filteredCategory];
        }
        if (!ex) {
          this.allCategories.push(this.selectedCategory);
        }
      }
      this.selectedCategoryEvent.next(this.selectedCategory);
    }
  }

  private  initResult(res) {
    // this.filteredCategory = res;
    this.allCategories = res;
    if (res.length > 0) {
      this.placeholder = 'search-category';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddSelectedCategory();

  }

  onChangeCategory(event) {
    if (event && event.hasOwnProperty('equipmentCategoryId')) {

      this.selectedCategoryEvent.next(this.selectedCategory);
    } else {
      this.selectedCategoryEvent.next(null);
    }
  }


  searchCategory(event) {

    this.filteredCategory = this.filterMatched(event.query);

  }


  handleDropdownClickForCategory() {

    this.filteredCategory = [...this.allCategories];

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allCategories && this.allCategories.length > 0) {
      for (let i = 0; i < this.allCategories.length; i++) {
        const obj = this.allCategories[i];
        if (obj['equipmentCategory'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    return filtered;
  }
  setSelectedCategory(selectedCategory) {
    this.selectedCategory = selectedCategory;
    this.allCategories.push(selectedCategory);
    this.handleDropdownClickForCategory();
    this.onChangeCategory(selectedCategory);
  }

}

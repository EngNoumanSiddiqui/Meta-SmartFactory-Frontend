import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {WorkstationService} from '../../../../../services/dto-services/workstation/workstation.service';
import {MaintenancePlanTypeService} from '../../../../../services/dto-services/maintenance/maintenance-plan-types.service';
import {EquipmentPlannerGroupService} from '../../../../../services/dto-services/maintenance-equipment/planner-group.service';
import {EquipmentAbcIndicatorService} from '../../../../../services/dto-services/maintenance-equipment/abc-indicator.service';
import {PlantService} from '../../../../../services/dto-services/plant/plant.service';
import {MaintenanceItemService} from '../../../../../services/dto-services/maintenance/maintenance-item.service';
import {MaintenancePlaningService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-planing.service';
import {FunctionalLocationService} from '../../../../../services/dto-services/maintenance-equipment/functional-location.service';
import {EquipmentService} from '../../../../../services/dto-services/equipment/equipment.service';
import {MaintenanceOrderTypeService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-order-type.service';
import {MaintenanceOrderPlanContent, MaintenanceWorkstation,
  MaintenanceFunctionalLocation, EquipmentTask, MaintanencePlanningPlant, MaintenanceOrderPlanType, EquipmentPlannerGroup, MaintenanceActivityType, Equipment, IMaintenanceOrderPlanItemList
} from '../../../../../dto/maintenance/maintenance-order-plan.dto';

@Component({
  selector: 'app-maintenance-planing-detail',
  templateUrl: './maintenance-planing-detail.component.html',
  styleUrls: ['./maintenance-planing-detail.component.scss']
})
export class MaintenancePlaningDetailComponent implements OnInit {
  dtModel: any;
  @Input() set dataModel (data: any) {
    if (!data.mainWorkStation) {
      data.mainWorkStation = {} as MaintenanceWorkstation;
    }
    if (!data.maintenanceFunctionalLocation) {
      data.maintenanceFunctionalLocation = {} as MaintenanceFunctionalLocation;
    }
    if (!data.equipmentTask) {
      data.equipmentTask = {} as EquipmentTask;
    }
    if (!data.planningPlant) {
      data.planningPlant = {} as MaintanencePlanningPlant;
    }
    if (!data.maintenanceOrderPlanType) {
      data.maintenanceOrderPlanType = {} as MaintenanceOrderPlanType;
    }
    if (data.maintenanceOrderPlanType) {
      data.maintenanceOrderPlanTypeId = data.maintenanceOrderPlanType;
    }
    if (!data.maintenanceOrderPlanItemList) {
      data.maintenanceOrderPlanItemList = [] as IMaintenanceOrderPlanItemList[];
    }
    if (!data.maintenanceOrderPlanCycleItemList) {
      data.maintenanceOrderPlanCycleItemList = [];
    }
    if (!data.maintenancePlannerGroup) {
      data.maintenancePlannerGroup = {} as EquipmentPlannerGroup;
    }
    if (!data.maintenanceActivityType) {
      data.maintenanceActivityType = {} as MaintenanceActivityType;
    }
    if (!data.equipment) {
      data.equipment = {} as Equipment;
    }
    if (data.maintenanceOrderPlanItem) {
      data.maintenanceOrderPlanItemList.length = 0; 
      data.maintenanceOrderPlanItemList.push(data.maintenanceOrderPlanItem);
    }
    this.dtModel = data;
  };

  get dataModel() {
    return this.dtModel;
  }
  selectedItem;
  functionalLocations: any[];
  equipmentList: any[];
  workstations: any[];
  maintenanceOrderPlanTypeList: any[];
  plannerGroup: any[];
  abcIndicators: any[];
  plantList: any[];
  itemList: any[];
  selectedCyclePlanItemUnit;
  selectedCyclePlanItem;
  orderTypeList: any[];
  selectedOrderType;
  selectedWorkstation;
  planTypeCode;
  cyclePlanItemList: any[];
  priority = [
    {value: 'VERY_HIGH', label: 'VERY HIGH'},
    {value: 'HIGH', label: 'HIGH'},
    {value: 'MEDIUM', label: 'MEDIUM'},
    {value: 'LOW', label: 'LOW'},
  ];
  constructor(
              private workstationService: WorkstationService,
              private maintenancePlanTypeService: MaintenancePlanTypeService,
              private plannerGroupService: EquipmentPlannerGroupService,
              private abcIndicatorService: EquipmentAbcIndicatorService,
              private plantService: PlantService,
              private maintenanceItemService: MaintenanceItemService,
              private maintenanceOrderTypeService: MaintenanceOrderTypeService,
              private functionalLocationService: FunctionalLocationService,
              private equipmentService: EquipmentService) { }

  ngOnInit() {
    // this.getFunctionalLocation();
    // this.getEquipmentList();
    // this.getWorkstation();
    // this.getMaintenancePlanTypes();
    // this.getAbcIndicator();
    // this.getPlannerGroup();
    // this.getMaintenancePlants();
    // this.getItems();
    // this.getMaintenanceOrderType();
  }
  getFunctionalLocation() {
    this.functionalLocationService.filter({pageSize: 100000, pageNumber: 1})
      .then(r => {
        this.functionalLocations = r['content'];
      }).catch();
  }

  getEquipmentList() {
    this.equipmentService.filter({pageSize: 100000, pageNumber: 1})
      .then(r => {
        this.equipmentList = r['content'];
      }).catch();
  }

  getWorkstation() {
    this.workstationService.filter({pageSize: 100000, pageNumber: 1})
      .then(r => {
        this.workstations = r['content'];
      }).catch();
  }
  getMaintenancePlanTypes() {
    this.maintenancePlanTypeService.filter({pageSize: 100000, pageNumber: 1})
      .then(r => {
        this.maintenanceOrderPlanTypeList = r['content'];
      }).catch();
  }
  getPlannerGroup() {
    this.plannerGroupService.filter({pageSize: 100000, pageNumber: 1})
      .then(r => {
        this.plannerGroup = r['content'];
      }).catch();
  }

  getAbcIndicator() {
    this.abcIndicatorService.filter({pageSize: 100000, pageNumber: 1})
      .then(r => {
        this.abcIndicators = r['content'];
      }).catch();
  }

  getMaintenancePlants() {
    this.plantService.getAllPlants()
      .then(r => {
        this.plantList = r as any[];
      }).catch();
  }
  getItems() {
    this.maintenanceItemService.filter({pageSize: 100000, pageNumber: 1})
      .then(r => {
        if (r) {
          this.itemList = r as any[];
        }

      }).catch();
  }
  getMaintenanceOrderType() {
    this.maintenanceOrderTypeService.filter({pageSize: 100000, pageNumber: 1})
      .then(r => {
        this.orderTypeList = r['content'];
      }).catch();
  }
  selectedMaintenanceActivityType(event) {
    if (event) {
      this.dataModel.maintenanceActivityType.maintenanceActivityTypeId = event.maintenanceActivityTypeId;
    } else {
      this.dataModel.maintenanceActivityType.maintenanceActivityTypeId = null;
    }
  }
changePlanType(code) {
    this.planTypeCode = code;
    console.log(code);
  }

}

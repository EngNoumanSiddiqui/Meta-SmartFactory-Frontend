import {Component, OnInit} from '@angular/core';
import {PowerConsumptionService} from '../../../services/dto-services/power-consumption/power-consumption-service';
import {PowerConsuptionSettingsDto, RequestTariffTypeDetailDtos} from '../../../dto/tariff/tariff.dtos';
import {ConfirmationService} from 'primeng/api';
import {UtilitiesService} from '../../../services/utilities.service';
import {CurrencyDto} from '../../../dto/currency/currency-dto';
/**
 * Created by reis on 27.10.2018.
 */

@Component({
  selector: 'power-consuption-settings',
  templateUrl: './power-consuption-settings.component.html',
  styleUrls: ['./power-consuption-settings.component.scss'],
  providers: [ConfirmationService]
})
export class PowerConsuptionSettingsComponent implements OnInit {


  selectedTariff;
  timePeriods = [
    {period: '2'},
    {period: '3'},
    {period: '4'}
  ];
  selectedTimePeriod;
  selectedStep;
  steps = [
    {step: '2'},
    {step: '3'},
    {step: '4'}
  ];
  fixedTariff = true;
  timeTariff = true;
  stepTariff = true;
  fixedUnitCost;
  currencies: CurrencyDto[];
  settingsData: PowerConsuptionSettingsDto = new PowerConsuptionSettingsDto();
  takenTimePeriodData: RequestTariffTypeDetailDtos[] = [];
  takenStepData: RequestTariffTypeDetailDtos[] = [];


  constructor(private powerConsService: PowerConsumptionService, private utilities: UtilitiesService) {
    this.currencies = [
      {currency: 'DOLAR'},
      {currency: 'EURO'}
    ];
  }

  ngOnInit() {
    this.getPowerConsuption();
  }

  save() {
    if (this.selectedTariff === 1) {
      this.settingsData.tariffTypeId = this.selectedTariff;
      this.settingsData.requestTariffTypeDetailDtos = [];
      this.takenTimePeriodData = [];
      this.takenStepData = [];
      this.settingsData.requestTariffTypeDetailDtos.push({
        stepEnd: null,
        stepStart: null,
        startTime: null,
        endTime: null,
        unitCost: this.fixedUnitCost
      });
      if (this.settingsData.requestTariffTypeDetailDtos !== []) {
        this.powerConsService.powerConsumptionSettingsSave(this.settingsData).then(() => {
          this.utilities.showSuccessToast('save-success');
          this.takenTimePeriodData = [];
          this.takenStepData = [];
          this.getPowerConsuption();
        }).catch(error => {
          this.utilities.showErrorToast(error);
        });
      }
    } else if (this.selectedTariff === 2) {
      this.settingsData.tariffTypeId = this.selectedTariff;
      this.settingsData.requestTariffTypeDetailDtos = [];
      for (let i = 0; i < this.takenTimePeriodData.length; i++) {
        this.settingsData.requestTariffTypeDetailDtos.push({
          stepEnd: null,
          stepStart: null,
          unitCost: this.takenTimePeriodData[i].unitCost,
          startTime: this.takenTimePeriodData[i].startTime.toString(),
          endTime: this.takenTimePeriodData[i].endTime.toString()
        });
      }
      if (this.settingsData.requestTariffTypeDetailDtos !== []) {
        this.powerConsService.powerConsumptionSettingsSave(this.settingsData).then(() => {
          this.utilities.showSuccessToast('save-success');
          this.takenTimePeriodData = [];
          this.takenStepData = [];
          this.fixedUnitCost = null;
          this.getPowerConsuption();
        }).catch(error => {
          this.utilities.showErrorToast(error);
        });
      }
    } else if (this.selectedTariff === 3) {
      this.settingsData.tariffTypeId = this.selectedTariff;
      this.settingsData.requestTariffTypeDetailDtos = [];
      for (let i = 0; i < this.takenStepData.length; i++) {
        if (i === 0) {
          this.takenStepData[i].stepStart = 0;
        } else {
          this.takenStepData[i].stepStart = this.takenStepData[i - 1].stepEnd;
        }
        this.settingsData.requestTariffTypeDetailDtos.push({
          startTime: null,
          endTime: null,
          unitCost: this.takenStepData[i].unitCost,
          stepStart: this.takenStepData[i].stepStart,
          stepEnd: this.takenStepData[i].stepEnd
        });
      }
      if (this.settingsData.requestTariffTypeDetailDtos !== []) {
        this.powerConsService.powerConsumptionSettingsSave(this.settingsData).then(() => {
          this.utilities.showSuccessToast('save-success');
          this.takenTimePeriodData = [];
          this.takenStepData = [];
          this.fixedUnitCost = null;
          this.getPowerConsuption();
        }).catch(error => {
          this.utilities.showErrorToast(error);
        });
      }
    }
  }

  getPowerConsuption() {
    this.powerConsService.getPowerConsuptionSetting().then(r => {
      this.textEditable(r['tariffTypeId'])
      this.settingsData.currency = r['currency'];
      if (r['tariffTypeId'] === 1) {
        this.takenTimePeriodData = [];
        this.takenStepData = [];
        this.fixedUnitCost = r['requestTariffTypeDetailDtos'][0].unitCost;
      } else if (r['tariffTypeId'] === 2) {
        this.takenTimePeriodData = r['requestTariffTypeDetailDtos'];
        this.selectedTimePeriod = r['requestTariffTypeDetailDtos'].length;
        this.takenStepData = [];
      } else if (r['tariffTypeId'] === 3) {
        this.takenStepData = r['requestTariffTypeDetailDtos'];
        this.selectedStep = r['requestTariffTypeDetailDtos'].length;
        this.takenTimePeriodData = [];
      }
    }).catch(e => {
      this.utilities.showErrorToast(e);
    });
  }

  textEditable(id) {
    if (id === 1) {
      this.fixedTariff = false;
      this.stepTariff = true;
      this.timeTariff = true;

    } else if (id === 2) {
      this.fixedTariff = true;
      this.stepTariff = true;
      this.timeTariff = false;

    } else if (id === 3) {
      this.fixedTariff = true;
      this.timeTariff = true;
      this.stepTariff = false;
    }
    this.selectedTariff = id;
  }

  selectedIteration() {
    this.takenTimePeriodData = [];
    for (let i = 1; i <= this.selectedTimePeriod.period; i++) {
      this.takenTimePeriodData.push(new RequestTariffTypeDetailDtos);
    }
  }

  selectedIteration2() {

    this.takenStepData = [];
    for (let i = 1; i <= this.selectedStep.step; i++) {
      this.takenStepData.push(new RequestTariffTypeDetailDtos);
    }
  }

  setStepStart(i) {
    if (this.takenStepData[i].stepEnd < this.takenStepData[i].stepStart) {
      this.utilities.showWarningToast('End step must be greater than start step!!');
    }
    if (i === 0) {
      this.takenStepData[i].stepStart = 0;
      this.takenStepData[i + 1].stepStart = this.takenStepData[i].stepEnd;
    } else {
      this.takenStepData[i + 1].stepStart = this.takenStepData[i].stepEnd;
    }
  }
}

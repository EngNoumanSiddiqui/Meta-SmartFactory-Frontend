import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { StockStrategyService } from 'app/services/dto-services/stock-stategy/stock-strategy.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { UtilitiesService } from 'app/services/utilities.service';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';


@Component({
  selector: 'app-stock-strategy',
  templateUrl: './stock-strategy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./stock-strategy.component.scss']
})
export class StockStrategyComponent implements OnInit, OnDestroy {

  @Input() readonly = false;
  private _stockId : string = null;
  stockStrategies = [];
  stockStrategyEnum = new Observable<[]>();
  yearList = [];
  monthList = [
    {id: 1, value: "January"},
    {id: 2, value: "February"},
    {id: 3, value:"March"},
    {id: 4, value: "April"},
    {id: 5, value: "May"},
    {id: 6, value: "June"},
    {id: 7, value: "July"},
    {id: 8, value: "August"},
    {id: 9, value: "September"},
    {id: 10, value: "October"},
    {id: 11, value: "November"},
    {id: 12, value: "December" }
  ];
  weekList = [];
  dayList = [];
  selectedStockStrategyEnum = null;
  subscription: Subscription;
  requestSent: boolean = false;
  shiftList = new BehaviorSubject<any[]>([]);;
  selectedPlant: any;
  @Input()
  public get stockId() : string {
    return this._stockId;
  }
  public set stockId(v : string) {
    this._stockId = v;
    this.pageFilter.stockId = v;
  }

  pageFilter = {
    day : null,
    month : null,
    orderByDirection : null,
    orderByProperty : null,
    pageNumber : 1,
    pageSize : 30,
    plantId: null,
    query : null,
    shiftId : null,
    stockId : null,
    stockStrategy : null,
    stockStrategyDetailId : null,
    week : null,
    year : null,
  };

  yearlyTargetList = new BehaviorSubject<any[]>([]);
  monthlyTargetList = new BehaviorSubject<any[]>([]);
  weeklyTargetList = new BehaviorSubject<any[]>([]);
  dailyTargetList = new BehaviorSubject<any[]>([]);
  shiftTargetList = new BehaviorSubject<any[]>([]);
  // new enums added
  basicTargetList = new BehaviorSubject<any[]>([]);
  timeTargetList = new BehaviorSubject<any[]>([]);
  supplyChainTargetList = new BehaviorSubject<any[]>([]);

  // next shift or day or year
  nextCount = 0;
  nextTitle = null;
  constructor( private loaderService: LoaderService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private uttilService: UtilitiesService,
    private _userSvc: UsersService,
    private shiftService: ShiftSettingsService,
    private enumService: EnumService,
    private stockStrategyService: StockStrategyService) { }

  ngOnInit() {

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);

    this.enumService.getStockStrategyEnum()
    .then(data => {
      this.stockStrategyEnum = of(data);
    }).catch(err => this.uttilService.showErrorToast(err));

    if(this._stockId) {
      this.loaderService.showLoader();
      this.pageFilter.stockId = this._stockId;
      this.pageFilter.plantId =this.selectedPlant.plantId;
      this.stockStrategyService.filter(this.pageFilter).then(res => {
        this.loaderService.hideLoader();
        this.stockStrategies = [...res['content']];
        this.yearlyTargetList.next(this.stockStrategies.filter(x => x.stockStrategy == 'YEARLY_TARGET'));
        this.monthlyTargetList.next(this.stockStrategies.filter(x => x.stockStrategy == 'MONTHLY_TARGET'));
        this.weeklyTargetList.next(this.stockStrategies.filter(x => x.stockStrategy == 'WEEKLY_TARGET'));
        this.dailyTargetList.next(this.stockStrategies.filter(x => x.stockStrategy == 'DAILY_TARGET'));
        this.shiftTargetList.next(this.stockStrategies.filter(x => x.stockStrategy == 'SHIFT_TARGET').map(x => ({...x, shiftId: x.shift?.shiftId})));

        this.basicTargetList.next(this.stockStrategies.filter(x => x.stockStrategy == 'BASIC_STRATEGY').map(x => ({...x, shiftId: x.shift?.shiftId, wareHouseId: x.wareHouse?.wareHouseId})));
        this.timeTargetList.next(this.stockStrategies.filter(x => x.stockStrategy == 'TIME_DEPENDENT').map(x => ({...x, shiftId: x.shift?.shiftId, wareHouseId: x.wareHouse?.wareHouseId})));
        this.supplyChainTargetList.next(this.stockStrategies.filter(x => x.stockStrategy == 'SUPPLY_CHAIN_STRATEGY').map(x => ({...x, shiftId: x.shift?.shiftId, wareHouseId: x.wareHouse?.wareHouseId})));


      }).catch(err => {
        this.loaderService.hideLoader();
        this.uttilService.showErrorToast(err);
      })
    }


    for (let index = 2010; index <= 2060; index++) {
      this.yearList.push(index);
    }

    for (let index = 1; index <= 53 ; index++) {
      this.weekList.push({id: index, value: index + ' Week'});
    }
    const days = ((new Date().getFullYear() % 4 === 0 && new Date().getFullYear() % 100 > 0) || new Date().getFullYear() %400 == 0) ? 366 : 365;
    for (let index = 1; index <= days ; index++) {
      this.dayList.push({id: index, value: index + ' Day'});
    }



    this.subscription = this.stockStrategyService.saveStockStrategyAction$.asObservable().subscribe(rs => {
      if(!this.requestSent) {
        this.save();
      }
    });


    this.shiftService.getShiftSettingsListByPlantId(this.selectedPlant.plantId).then((res: any) => {
      // this.shiftList.next(res);
      this.shiftList.next([...res.filter(x => x.shiftName.includes('Dummy') == false)
        .sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime))]);
      // this.shiftList.pipe(map(items => {
      //   if(items && items.length > 0) {
      //     items = items.filter(x => x.shiftName.includes('Dummy') == false).sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime));
      //   }
      // }));

    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  addStrategyTypeList(event=null) {
    let dto = {
      completedQuantity : null,
      day : null,
      maxPlannedQuantity : null,
      minPlannedQuantity : null,
      month : null,
      plannedQuantity : null,
      shiftId : null,
      stockId : this._stockId,
      reorderPoint: null,
      safetyStock: null,
      wareHouseId: null,
      maxStockLevel: null,
      stockStrategy : null,
      stockStrategyDetailId : null,
      shiftTargetQuantity: null,
      targetQuantity : null,
      week : null,
      year : null,
    };
    switch (event || this.selectedStockStrategyEnum) {
      case 'YEARLY_TARGET':
        dto.year = new Date().getFullYear();
        dto.stockStrategy = 'YEARLY_TARGET';
        this.yearlyTargetList.next([...this.yearlyTargetList.getValue(), dto]);
        break;
      case 'MONTHLY_TARGET':
        dto.year = new Date().getFullYear();
        dto.month = new Date().getMonth() + 1;
        dto.stockStrategy = 'MONTHLY_TARGET';
        this.monthlyTargetList.next([...this.monthlyTargetList.getValue(), dto]);

        break;
      case 'WEEKLY_TARGET':
        dto.year = new Date().getFullYear();
        dto.month = new Date().getMonth() + 1;
        dto.week = this.getWeekNumber(new Date()) + '';
        dto.stockStrategy = 'WEEKLY_TARGET';
        this.weeklyTargetList.next([...this.weeklyTargetList.getValue(), dto]);

        break;
      case 'DAILY_TARGET':
        dto.year = new Date().getFullYear();
        dto.month = new Date().getMonth() + 1;
        dto.week = this.getWeekNumber(new Date()) + '';
        dto.day = new Date().getDate();
        dto.stockStrategy = 'DAILY_TARGET';
        this.dailyTargetList.next([...this.dailyTargetList.getValue(), dto]);

        break;
      case 'SHIFT_TARGET':
        dto.year = new Date().getFullYear();
        dto.month = new Date().getMonth() + 1;
        dto.week = this.getWeekNumber(new Date()) + '';
        dto.day = new Date().getDate();
        dto.stockStrategy = 'SHIFT_TARGET';
        this.shiftTargetList.next([...this.shiftTargetList.getValue(), dto]);
        break;
      case 'BASIC_STRATEGY':
        dto.stockStrategy = 'BASIC_STRATEGY';
        this.basicTargetList.next([...this.basicTargetList.getValue(), dto]);
        break;
      case 'TIME_DEPENDENT':
        dto.stockStrategy = 'TIME_DEPENDENT';
        this.timeTargetList.next([...this.timeTargetList.getValue(), dto]);
        break;
      case 'SUPPLY_CHAIN_STRATEGY':
        dto.stockStrategy = 'SUPPLY_CHAIN_STRATEGY';
        this.supplyChainTargetList.next([...this.supplyChainTargetList.getValue(), dto]);
        break;
      default:
        break;
    }
  }

  save() {
    const items = [...this.yearlyTargetList.getValue(), ...this.monthlyTargetList.getValue(),
     ...this.weeklyTargetList.getValue(),...this.dailyTargetList.getValue(),
     ...this.shiftTargetList.getValue(), ...this.basicTargetList.getValue(),
     ...this.timeTargetList.getValue(), ...this.supplyChainTargetList.getValue()];
    items.forEach(dto => {
      dto.stockId = this.stockId;
      if(dto.shiftId) {
        dto.shiftId = +dto.shiftId;
      }
      if(dto.week) {
        dto.week = +dto.week;
      }
      if(dto.day) {
        dto.day = +dto.day;
      }
      if(dto.month) {
        dto.month = +dto.month;
      }
      if(dto.year) {
        dto.year = +dto.year;
      }
    });
    this.requestSent = true;
    this.stockStrategyService.saveAll(items).then(stockId => {
      this.uttilService.showSuccessToast('Stock Strategy saved successfully');
      setTimeout(() => {
        this.requestSent = false;
      }, 3000);

    }).catch(error => {
      this.requestSent = false;
      this.uttilService.showErrorToast(error);
    });

  }

  getWeekNumber(date) {
    let d: any = new Date(date);
    d.setHours(0, 0, 0, 0);
    // d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    let yearStart: any = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + + d.getDay()  + 1) / 7);

    // return moment(d).week();
    // let oneJan: any = new Date(currentdate.getFullYear(),0,1);
    // let numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    // return Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
  }

  getWeekList = (item): any[] => {
    let weeks = [],
    lastDate = new Date(+item.year, +item.month, 0),
    numDays = lastDate.getDate();
    for (let date = 1; date <= numDays; date++) {
      // if (dayOfWeekCounter === 0 || weeks.length === 0) {
      //   weeks.push([]);
      // }
      let weekNo =  this.getWeekNumber(new Date(+item.year, +item.month-1, date));
      if(!weeks.find(itm => itm.id == weekNo)) {
        weeks.push({id: weekNo, value: weekNo + ' Week'});
      }
      // weeks.push({id: weekNo, value: weekNo + ' Week'});

      // weeks[weeks.length - 1].push(date);
      // dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
    }

    // let weekList = [];
    // for (let index = 1; index <= this.getMonthDays(month); index++) {
    //   weekList.push({id: index, value: index + ' Day'});
    // }
    // weeks = Object.values(
    //   weeks.reduce((a, c) => {
    //     a[c.id] = c;
    //     return a
    //   }, {})) || [];
    return weeks;
  }


  delete(strategyItem, index) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        if(strategyItem.stockStrategyDetailId) {
          this.loaderService.showLoader();
          this.stockStrategyService.delete(strategyItem.stockStrategyDetailId).then(res => {
            switch (strategyItem.stockStrategy) {
              case 'YEARLY_TARGET':
                this.yearlyTargetList.getValue().splice(index, 1);
                this.yearlyTargetList.next([...this.yearlyTargetList.getValue()]);
                break;
              case 'MONTHLY_TARGET':
                this.monthlyTargetList.getValue().splice(index, 1);
                this.monthlyTargetList.next([...this.monthlyTargetList.getValue()]);
                break;
              case 'WEEKLY_TARGET':
                this.weeklyTargetList.getValue().splice(index, 1);
                this.weeklyTargetList.next([...this.weeklyTargetList.getValue()]);
                break;
              case 'DAILY_TARGET':
                this.dailyTargetList.getValue().splice(index, 1);
                this.dailyTargetList.next([...this.dailyTargetList.getValue()]);
                break;
              case 'SHIFT_TARGET':
                this.shiftTargetList.getValue().splice(index, 1);
                this.shiftTargetList.next([...this.shiftTargetList.getValue()]);
                break;
              case 'BASIC_STRATEGY':
                this.basicTargetList.getValue().splice(index, 1);
                this.basicTargetList.next([...this.basicTargetList.getValue()]);
                break;
              case 'TIME_DEPENDENT':
                this.timeTargetList.getValue().splice(index, 1);
                this.timeTargetList.next([...this.timeTargetList.getValue()]);
                break;
              case 'SUPPLY_CHAIN_STRATEGY':
                this.supplyChainTargetList.getValue().splice(index, 1);
                this.supplyChainTargetList.next([...this.supplyChainTargetList.getValue()]);
                break;
              default:
                break;
            }
            this.uttilService.showSuccessToast(this._translateSvc.instant('deleted-successfully'));
            this.loaderService.hideLoader();
          }).catch(err => {
            this.uttilService.showErrorToast(err);
            this.loaderService.hideLoader();
          });

        } else {
          switch (strategyItem.stockStrategy) {
            case 'YEARLY_TARGET':
              this.yearlyTargetList.getValue().splice(index, 1);
              this.yearlyTargetList.next([...this.yearlyTargetList.getValue()]);
              break;
            case 'MONTHLY_TARGET':
              this.monthlyTargetList.getValue().splice(index, 1);
              this.monthlyTargetList.next([...this.monthlyTargetList.getValue()]);
              break;
            case 'WEEKLY_TARGET':
              this.weeklyTargetList.getValue().splice(index, 1);
              this.weeklyTargetList.next([...this.weeklyTargetList.getValue()]);
              break;
            case 'DAILY_TARGET':
              this.dailyTargetList.getValue().splice(index, 1);
              this.dailyTargetList.next([...this.dailyTargetList.getValue()]);
              break;
            case 'SHIFT_TARGET':
              this.shiftTargetList.getValue().splice(index, 1);
              this.shiftTargetList.next([...this.shiftTargetList.getValue()]);
              break;
            case 'BASIC_STRATEGY':
              this.basicTargetList.getValue().splice(index, 1);
              this.basicTargetList.next([...this.basicTargetList.getValue()]);
              break;
            case 'TIME_DEPENDENT':
              this.timeTargetList.getValue().splice(index, 1);
              this.timeTargetList.next([...this.timeTargetList.getValue()]);
              break;
            case 'SUPPLY_CHAIN_STRATEGY':
              this.supplyChainTargetList.getValue().splice(index, 1);
              this.supplyChainTargetList.next([...this.supplyChainTargetList.getValue()]);
              break;
            default:
              break;
          }
        }
      },
      reject: () => {
        // this.uttilService.showInfoToast('cancelled-operation');
      }
    })

  }


  onCreateForNextSelection() {
    let dto = {
      completedQuantity : null,
      day : null,
      maxPlannedQuantity : null,
      minPlannedQuantity : null,
      month : null,
      reorderPoint: null,
      safetyStock: null,
      wareHouseId: null,
      maxStockLevel: null,
      plannedQuantity : null,
      shiftId : null,
      stockId : this._stockId,
      stockStrategy : null,
      stockStrategyDetailId : null,
      shiftTargetQuantity: null,
      targetQuantity : null,
      week : null,
      year : null,
    };

    this.loaderService.showLoader();
    setTimeout(() => {
      switch (this.selectedStockStrategyEnum) {
        case 'YEARLY_TARGET':
          const yearlyTGList = this.yearlyTargetList.getValue();
          if(yearlyTGList.length > 0) {
            let lastItem = yearlyTGList[yearlyTGList.length - 1];
            let date = new Date(lastItem.year, (lastItem.month - 1) || 10, (lastItem.day) || 1);
            date.setFullYear(date.getFullYear() + (+this.nextCount) + 1);
            dto.year = date.getFullYear();
            dto.stockStrategy = 'YEARLY_TARGET';
            this.yearlyTargetList.next([...this.yearlyTargetList.getValue(), dto]);
          }
          break;
        case 'MONTHLY_TARGET':
          const monthlyTGList = this.monthlyTargetList.getValue();
          if(monthlyTGList.length > 0) {
            let lastItem = monthlyTGList[monthlyTGList.length - 1];
            let date = new Date(lastItem.year, lastItem.month - 1, (lastItem.day) || 1);
            date.setMonth(date.getMonth() +  (+this.nextCount));
            dto.year = date.getFullYear();
            dto.month = date.getMonth() + 1;
            dto.stockStrategy = 'MONTHLY_TARGET';
            this.monthlyTargetList.next([...this.monthlyTargetList.getValue(), dto]);
          }

          break;
        case 'WEEKLY_TARGET':
          const weeklyTGList = this.weeklyTargetList.getValue();
          if(weeklyTGList.length > 0) {
            let lastItem = weeklyTGList[weeklyTGList.length - 1];
            let day = this.getDayFromWeekNum(lastItem.week, lastItem.year);
            let date = new Date(lastItem.year, lastItem.month - 1, lastItem.day || day.getDate());
            date.setDate(date.getDate() + (+this.nextCount) * 7);
            dto.year = date.getFullYear();
            dto.month = date.getMonth() + 1;
            dto.week = this.getWeekNumber(date);
            dto.stockStrategy = 'WEEKLY_TARGET';
            this.weeklyTargetList.next([...this.weeklyTargetList.getValue(), dto]);
          }
          break;
        case 'DAILY_TARGET':
          const dailyTGList = this.dailyTargetList.getValue();
          if(dailyTGList.length > 0) {
            let lastItem = dailyTGList[dailyTGList.length - 1];
            let date = new Date(lastItem.year, lastItem.month - 1, lastItem.day);
            date.setDate(date.getDate() + (+this.nextCount));
            dto.year = date.getFullYear();
            dto.month = date.getMonth() + 1;
            dto.week = this.getWeekNumber(date);
            dto.day = lastItem.day === (new Date(lastItem.year, lastItem.month).getFullYear() % 4 == 0 ? 366 : 365) ? 1 : lastItem.day + 1;
            dto.stockStrategy = 'DAILY_TARGET';
            this.dailyTargetList.next([...this.dailyTargetList.getValue(), dto]);
          }

          break;
        case 'SHIFT_TARGET':
          if(this.shiftTargetList.getValue().length > 0) {
            for (let index = 0; index < (+this.nextCount); index++) {
              let PlastItem = this.shiftTargetList.getValue()[this.shiftTargetList.getValue().length - 1];
              if(index !==0) {
                dto.day = (PlastItem.day === (new Date(PlastItem.year, PlastItem.month).getFullYear() % 4 == 0 ? 366 : 365) ? 1 : +(PlastItem.day + 1));
              } else {
                dto.day = (PlastItem.day === (new Date(PlastItem.year, PlastItem.month).getFullYear() % 4 == 0 ? 366 : 365) ? 1 : +(PlastItem.day));
              }
              this.shiftList.getValue().forEach(shift => {
                  let shiftId = null;
                  let lastItem = this.shiftTargetList.getValue()[this.shiftTargetList.getValue().length - 1];
                  if(lastItem.shiftId !== shift.shiftId) {
                    if(this.shiftList.getValue().findIndex(x => x.shiftId === lastItem.shiftId) < this.shiftList.getValue().length - 1) {
                      shiftId = shift.shiftId;
                    } else {
                      shiftId = this.shiftList.getValue()[0].shiftId;
                    }
                    let date = new Date(PlastItem.year, PlastItem.month - 1, moment().dayOfYear(+PlastItem.day).date());
                    date.setDate(date.getDate() + index);
                    dto.year = date.getFullYear();
                    dto.month = date.getMonth() + 1;
                    dto.week = this.getWeekNumber(date);
                    dto.shiftId = shiftId;
                    dto.stockStrategy = 'SHIFT_TARGET';
                    this.shiftTargetList.next([...this.shiftTargetList.getValue(), {...dto}]);
                  }
              });
            }
          }
          break;
        default:
          break;
      }
      this.loaderService.hideLoader();
    }, 100);


  }


  getDayFromWeekNum = (weekNum, year) => {
    const sunday = new Date(year, 0, ((+weekNum - 1) * 7));
    while (sunday.getDay() !== 0) {
      if(sunday.getDay() > 4) {
        sunday.setDate(sunday.getDate() + 1);
      } else {
        sunday.setDate(sunday.getDate() - 1);
      }

    }
    return sunday;
  }

}

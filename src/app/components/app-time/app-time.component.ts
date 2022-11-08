import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-time',
  templateUrl: './app-time.component.html',
  styleUrls: ['./app-time.component.css'],

})

export class AppTimeComponent implements OnInit {

  @Output() timeChanged = new EventEmitter();


  timeInMills;


  @Input() showMills = false;
  @Input() name = 'float';
  @Input() total = false;
  @Input() disabled = false;
  firstTime = false;
  @Input('timeInMills') set a(timeInMills) {
    if ((!this.firstTime || this.total) && timeInMills) {
      this.timeInMills = timeInMills;
      this.initializeSetups(timeInMills);
      this.firstTime = true;
    } else if(timeInMills=== 0) {
      this.daysSetup = 0;
      this.hoursSetup = 0;
      this.minutesSetup = 0;
      this.secondsSetup = 0;
      this.millsSetup = 0;
    }
  }

  daysSetup: number = 0;
  hoursSetup: number = 0;
  minutesSetup: number = 0;
  secondsSetup: number = 0;
  millsSetup: number = 0;

  constructor() {

  }


  ngOnInit() {

  }


  private initializeSetups(setup) {
    setup = setup ? setup : 0;
    // var duration = moment.duration(setup);
    // this.daysSetup = Math.floor(duration.asDays());
    // this.hoursSetup = Math.floor(duration.asHours());
    // this.minutesSetup = Math.floor(duration.asMinutes());
    // this.secondsSetup = Math.floor(duration.asSeconds());
    // this.millsSetup = Math.floor(duration.asMilliseconds());
    let val = setup;
    this.daysSetup = Math.floor(val / ( 24 * 60 * 60 * 1000));
    val -= this.daysSetup * ( 24 * 60 * 60 * 1000);
    this.hoursSetup = Math.floor(val / (   60 * 60 * 1000));
    val -= this.hoursSetup * (60 * 60 * 1000);
    this.minutesSetup = Math.floor(val / (   60 * 1000));
    val -= this.minutesSetup * ( 60 * 1000);
    this.secondsSetup = Math.floor(val / 1000);
    if ((this.secondsSetup !== 0) && (this.secondsSetup < 10)) {
      // tslint:disable-next-line: no-unused-expression
      const van: any = '0' + this.secondsSetup;
      this.secondsSetup = van;
    }
    val -= this.secondsSetup * (1000);
    this.millsSetup = Math.floor(val);

  }

  private setupsToSingle(): number {
    const val = this.daysSetup * ( 24 * 60 * 60 * 1000)
      + this.hoursSetup * (   60 * 60 * 1000)
      + this.minutesSetup * (  60 * 1000)
      + this.secondsSetup * (  1000)
      + this.millsSetup;

    return val;
  }

  sendTimeChanged(event, inputName) {
    if (inputName === 'secondsSetup') {
      this.secondsSetup = event;
    } else if (inputName === 'minutesSetup') {
      this.minutesSetup = event;
    } else if (inputName === 'hoursSetup') {
      this.hoursSetup = event;
    }  else if (inputName === 'daysSetup') {
      this.daysSetup = event;
    }  else if (inputName === 'millsSetup') {
      this.millsSetup = event;
    }
    const time = this.setupsToSingle();

    this.timeChanged.next(time);
  }

}

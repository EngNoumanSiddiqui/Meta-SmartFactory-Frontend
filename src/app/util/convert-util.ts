import * as moment from 'moment';

export class ConvertUtil {


  public static isDST(d) {
    let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== d.getTimezoneOffset();    
  }

  public static longDuration2DHHMMSSsssTime(duration): string {

    let stringDur = '';
    if (duration !== null) {
      let val = duration;
      const daysDuration = Math.floor(val / (24 * 60 * 60 * 1000));
      if (daysDuration > 0) {
        stringDur += daysDuration + 'd, ';
      }
      val -= daysDuration * (24 * 60 * 60 * 1000);
      const hoursDuration = Math.floor(val / (60 * 60 * 1000));
      if (hoursDuration < 10) {
        stringDur += '0' + hoursDuration + ':';
      } else {
        stringDur += hoursDuration + ':';
      }
      val -= hoursDuration * (60 * 60 * 1000);
      const minutesDuration = Math.floor(val / (60 * 1000));
      if (minutesDuration < 10) {
        stringDur += '0' + minutesDuration + ':';
      } else {
        stringDur += minutesDuration + ':';
      }
      val -= minutesDuration * (60 * 1000);
      const secondsDuration = Math.floor(val / (1000));
      if (secondsDuration < 10) {
        stringDur += '0' + secondsDuration + ':';
      } else {
        stringDur += secondsDuration + ':';
      }
      val -= secondsDuration * (1000);
      const millsDuration = Math.floor(val);
      // convert mills to 000 format
      const millsLength = 3 - millsDuration.toString().length;

      let stringMills = '' + millsDuration;
      for (let i = 0; i < millsLength; i++) {
        stringMills = '0' + stringMills;
      }

      stringDur += stringMills;
    }
    return stringDur;
  }


  public static longDuration2DHHMMSSTime(duration): string {
    let stringDur = '';


    if (duration || duration === 0) {


      const isMinus = duration < 0;
      if (isMinus) {

        duration = duration * (-1);
      }

      let val = duration;
      const daysDuration = Math.floor(val / (24 * 60 * 60 * 1000));
      if (daysDuration > 0) {
        stringDur += daysDuration + 'd, ';
      }
      val -= daysDuration * (24 * 60 * 60 * 1000);
      const hoursDuration = Math.floor(val / (60 * 60 * 1000));
      if (hoursDuration < 10) {
        stringDur += '0' + hoursDuration + ':';
      } else {
        stringDur += hoursDuration + ':';
      }
      val -= hoursDuration * (60 * 60 * 1000);
      const minutesDuration = Math.floor(val / (60 * 1000));
      if (minutesDuration < 10) {
        stringDur += '0' + minutesDuration + ':';
      } else {
        stringDur += minutesDuration + ':';
      }
      val -= minutesDuration * (60 * 1000);
      const secondsDuration = Math.floor(val / (1000));
      if (secondsDuration < 10) {
        stringDur += '0' + secondsDuration;
      } else {
        stringDur += secondsDuration;
      }


      if (isMinus) {

        return '-' + stringDur;
      }
    }
    return stringDur;
  }

  public static longDuration2HHMMSSTime(duration): string {
    let stringDur = '';


    if (duration || duration === 0) {


      const isMinus = duration < 0;
      if (isMinus) {

        duration = duration * (-1);
      }

      let val = duration;
      // const daysDuration = Math.floor(val / (24 * 60 * 60 * 1000));
      // if (daysDuration > 0) {
      //   stringDur += daysDuration + 'd, ';
      // }
      // val -= daysDuration * (24 * 60 * 60 * 1000);
      const hoursDuration = Math.floor(val / (60 * 60 * 1000));
      if (hoursDuration < 10) {
        stringDur += '0' + hoursDuration + ':';
      } else {
        stringDur += hoursDuration + ':';
      }
      val -= hoursDuration * (60 * 60 * 1000);
      const minutesDuration = Math.floor(val / (60 * 1000));
      if (minutesDuration < 10) {
        stringDur += '0' + minutesDuration + ':';
      } else {
        stringDur += minutesDuration + ':';
      }
      val -= minutesDuration * (60 * 1000);
      const secondsDuration = Math.floor(val / (1000));
      if (secondsDuration < 10) {
        stringDur += '0' + secondsDuration;
      } else {
        stringDur += secondsDuration;
      }


      if (isMinus) {

        return '-' + stringDur;
      }
    }
    return stringDur;
  }

  public static secondDuration2DHHMMSSTime(second): string {

    const stringDur = '';

    if (second) {
      const val = second * 1000;
      return this.longDuration2DHHMMSSTime(val);

    }
    return stringDur;
  }

  public static millisecondDuration2DHHMMSSTime(second): string {

    const stringDur = '';

    if (second) {
      const val = second;
      return this.longDuration2DHHMMSSTime(val);

    }
    return stringDur;
  }

  public static minuteDuration2StrTime(duration): string {

    const stringDur = '';

    if (duration) {
      const val = duration * 60 * 1000;
      return this.longDuration2DHHMMSSTime(val);

    }
    return stringDur;
  }

  /**
   *
   * @param hours
   * return in HH:mm:ss
   */
  public static hourDuration2StrTime(duration): string {

    const stringDur = '';

    if (duration) {
      const val = duration * 60 * 60 * 1000;
      return this.longDuration2DHHMMSSTime(val);

    }
    return stringDur;
  }

  public static hourDuration2HHMMSSTime(duration): string {

    const stringDur = '';

    if (duration) {
      const val = duration * 60 * 60 * 1000;
      return this.longDuration2HHMMSSTime(val);

    }
    return stringDur;
  }

  /**
   *
   * @param seconds
   * return in HH:mm:ss
   */
  public static secondsTimeSpanToHMS(s) {
    const h = Math.floor(s / 3600); // Get whole hours
    s -= h * 3600;
    const m = Math.floor(s / 60); // Get remaining minutes
    s -= m * 60;
    return h + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s); // zero padding on minutes and seconds
  }

  public static localDateShiftAsUTC(date) {
    const ofset = moment().utcOffset();
    return moment(date).add(ofset, 'minutes').toDate();
  }
  public static sameDay( d1, d2 ){
    return d1.getUTCFullYear() == d2.getUTCFullYear() &&
           d1.getUTCMonth() == d2.getUTCMonth() &&
           d1.getUTCDate() == d2.getUTCDate();
  }

  public static isFloat(n){
    return Number(n) === n && n % 1 !== 0;
  }

  public static isInt(n){
    return Number(n) === n && n % 1 === 0;
  }

  public static convertMilisecondsToMinutes(miliseconds, allowSeconds = false) {
    const ms = 1000 * Math.round(miliseconds / 1000); // round to nearest second
    const d = new Date(ms);
    let minutes: any = d.getUTCMinutes();

    if (allowSeconds) {
      minutes = minutes + ':' + d.getUTCSeconds()
    }

    return minutes;
  }
  public static convertMilisecondsToHours(miliseconds) {
    return miliseconds/(60*60*1000);
    // const ms = 1000 * Math.round(miliseconds / 1000); // round to nearest second
    // const d = new Date(ms);
    // let hours: any = d.getUTCHours();
    //
    // if (d.getMinutes() > 0) {
    //   hours = hours + parseFloat((d.getUTCMinutes() / 60).toFixed(2));
    // }
    //
    // return hours;
  }

  public static date2EndOfDay(date) {
    return moment(date).endOf('day').toDate();
  }

  public static date2StartOfDay(date) {
    return moment(date).startOf('day').toDate();
  }

  public static localDate2UTC(date) {
    const ofset = moment().utcOffset();
    return moment(date).subtract(ofset, 'minutes').toDate();
    // return moment(date).utc().toDate();
  }

  public static UTCTime2LocalTime(time) {
    const offset = moment().utcOffset();
    return moment(time, 'HH:mm:ss').add(offset, 'minutes').format('HH:mm:ss');
  }

  public static isEmptyString(str: string) {
    return !str || str.length === 0; // Or any other logic, removing whitespace, etc.
  }

  public static removeDuplicatedDataInArray(originalArray, prop) {
    const newArray = [];
    const lookupObject = {};
    // tslint:disable-next-line: forin
    for (const i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    // tslint:disable-next-line: forin
    for (const i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }


  public static hexToRGB(hex, alpha?) {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } else {
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
  }

  public static dynamicColors() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return '' + r + ',' + g + ',' + b;
  };

  public static lightOrDark(color): string {

    let r, g, b, hsp = null;
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
    } else {

      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +('0x' + color.slice(1).replace(
          color.length < 5 && /./g, '$&$&'
        )
      );

      // tslint:disable-next-line: no-bitwise
      r = color >> 16;
      // tslint:disable-next-line: no-bitwise
      g = color >> 8 & 255;
      // tslint:disable-next-line: no-bitwise
      b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    return (hsp && (hsp > 127.5)) ? 'light' : 'dark';
    // if (hsp > 127.5) {
    //   return 'light';
    // }  else {

    //   return 'dark';
    // }
  }

  public static dynamicHEXColors() {
    const r = Math.floor(Math.random() * 255).toString(16);
    const g = Math.floor(Math.random() * 255).toString(16);
    const b = Math.floor(Math.random() * 255).toString(16);

    const rr = (r.length < 2 ? '0' : '') + r
    const gg = (g.length < 2 ? '0' : '') + g
    const bb = (b.length < 2 ? '0' : '') + b
    return `#${rr}${gg}${bb}`

  };
  public static getUniqueColor(n) {
    const rgb = [0, 0, 0];
    for (let i = 0; i < 24; i++) {
      rgb[i%3] <<= 1;
      rgb[i%3] |= n & 0x01;
      n >>= 1;
    }
    return '#' + rgb.reduce((a, c) => (c > 0x0f ? c.toString(16) : '0' + c.toString(16)) + a, '')
  }

  public static getAndChecktNumber(value) {
    if (value === undefined || value === null) {
      return 0;
    }
    if (typeof value === 'number') {
      if (value%1 == 0) {
        return value;
      } else {
        return parseFloat(value.toFixed(2));
      }
    }
    return value;
  }

  public static dynamicRGBColors(alpha?) {
    const color = this.dynamicColors();

    if (alpha && Number.isInteger(alpha) && alpha >= 0 && alpha <= 1) {
      return 'rgba(' + color + ',' + alpha + ')';
    } else {
      return 'rgb(' + color + ')';
    }

  };

  /***
   * this method darker or lighter hex color
   * to darker give amt as minus value
   * to lighter give amt as positive value
   * amt value should be between -255 , +255 rage value
   */
  public static colorShade(col, amt) {
    col = col.replace(/^#/, '')
    if (col.length === 3) {
      col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2]
    }

    let [r, g, b] = col.match(/.{2}/g);
    ([r, g, b] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt])

    r = Math.max(Math.min(255, r), 0).toString(16)
    g = Math.max(Math.min(255, g), 0).toString(16)
    b = Math.max(Math.min(255, b), 0).toString(16)

    const rr = (r.length < 2 ? '0' : '') + r
    const gg = (g.length < 2 ? '0' : '') + g
    const bb = (b.length < 2 ? '0' : '') + b

    return `#${rr}${gg}${bb}`
  }


  public static fix(value, num) {
    if (value) {
      return value.toFixed(num);
    }
    return 0;
  }

  public static fixIfFracted(value, num) {
    if (value) {
      if (num > 0) {

        const val = Math.pow(10, num)
        if ((value * val) % val === 0) {
          return value
        }
        return parseFloat(value.toFixed(num));

      }
      return parseFloat(value.toFixed(num));
    }
    return 0;
  }

  public static getSimpleUId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  public static getIntervalsV2(startTime, endTime, intervalString) {

    const start = startTime.split(':');
    let end = endTime.split(':');
    if(end[1] !== '00') {
      end[0] = Number(end[0])+1;
      end[1] = '00';
    }
    const interval = intervalString.split(':');
    const startInMinutes = start[0] * 60 + start[1] * 1;
    const endInMinutes = end[0] * 60 + end[1] * 1;
    let intervalsOfTime = [];

    if (startInMinutes === endInMinutes) {
      // intervalsOfTime.push(start[0] + ':' + start[1]);
      // intervalsOfTime.push(end[0] + ':' + end[1]);
      // for getting list of 24 hrs intervals
      for (let i = startInMinutes; i <= 24 * 60; i += 60) {
        let hour = Math.floor(i / 60) + '';
        let minute = i % 60 + '';
        minute = (minute.length < 2) ? '0' + minute : minute;
        hour = (hour.length < 2) ? '0' + hour : hour;
        intervalsOfTime.push(hour + ':' + minute);
      }

      for (let i = 60; i <= endInMinutes; i += 60) {
        let hour = Math.floor(i / 60) + '';
        let minute = i % 60 + '';
        minute = (minute.length < 2) ? '0' + minute : minute;
        hour = (hour.length < 2) ? '0' + hour : hour;
        intervalsOfTime.push(hour + ':' + minute);
      }
    } else if (startInMinutes > endInMinutes) {
      for (let i = startInMinutes; i <= 24 * 60; i += 60) {
        let hour = Math.floor(i / 60) + '';
        let minute = i % 60 + '';
        minute = (minute.length < 2) ? '0' + minute : minute;
        hour = (hour.length < 2) ? '0' + hour : hour;
        intervalsOfTime.push(hour + ':' + minute);
      }

      for (let i = 60; i <= endInMinutes; i += 60) {
        let hour = Math.floor(i / 60) + '';
        let minute = i % 60 + '';
        minute = (minute.length < 2) ? '0' + minute : minute;
        hour = (hour.length < 2) ? '0' + hour : hour;
        intervalsOfTime.push(hour + ':' + minute);
      }

    } else {
      for (let i = startInMinutes; i <= endInMinutes + 1; i += 60) {
        let hour = Math.floor(i / 60) + '';
        let minute = i % 60 + '';
        minute = (minute.length < 2) ? '0' + minute : minute;
        hour = (hour.length < 2) ? '0' + hour : hour;
        intervalsOfTime.push(hour + ':' + minute);
      }
    }

    intervalsOfTime = intervalsOfTime.filter((res, index) => {
      return (index % parseInt(interval[0], 10) === 0 || index === (intervalsOfTime.length - 1))
    })

    return intervalsOfTime;
  }

  // get total hours from start and end time
  public static getTotalHours(startTime, endTime) {
    const start = startTime.split(':');
    const end = endTime.split(':');
    const startInMinutes = start[0] * 60 + start[1] * 1;
    const endInMinutes = end[0] * 60 + end[1] * 1;
    let totalHours = 0;
    if (startInMinutes === endInMinutes) {
      totalHours = 0;
    } else if (startInMinutes > endInMinutes) {
      totalHours = 24 - (startInMinutes - endInMinutes) / 60;
    } else {
      totalHours = (endInMinutes - startInMinutes) / 60;
    }
    return totalHours;
  }

  public static getIntervals(startTime, endTime, intervalString) {

    const start = startTime.split(':');
    let end = endTime.split(':');
    if(end[1] !== '00') {
      end[0] = Number(end[0])+1+'';
      end[1] = '00';
    }
    const interval = intervalString.split(':');
    const startInMinutes = start[0] * 60 + start[1] * 1;
    const endInMinutes = end[0] * 60 + end[1] * 1;
    let intervalsOfTime = [];

    if (startInMinutes === endInMinutes) {
      intervalsOfTime.push(start[0] + ':' + start[1]);
      intervalsOfTime.push(end[0] + ':' + end[1]);
     
    } else if (startInMinutes > endInMinutes) {
      for (let i = startInMinutes; i <= 24 * 60; i += 60) {
        let hour = Math.floor(i / 60) + '';
        let minute = i % 60 + '';
        minute = (minute.length < 2) ? '0' + minute : minute;
        hour = (hour.length < 2) ? '0' + hour : hour;
        intervalsOfTime.push(hour + ':' + minute);
      }

      for (let i = 60; i <= endInMinutes; i += 60) {
        let hour = Math.floor(i / 60) + '';
        let minute = i % 60 + '';
        minute = (minute.length < 2) ? '0' + minute : minute;
        hour = (hour.length < 2) ? '0' + hour : hour;
        intervalsOfTime.push(hour + ':' + minute);
      }

    } else {
      for (let i = startInMinutes; i <= endInMinutes + 1; i += 60) {
        let hour = Math.floor(i / 60) + '';
        let minute = i % 60 + '';
        minute = (minute.length < 2) ? '0' + minute : minute;
        hour = (hour.length < 2) ? '0' + hour : hour;
        intervalsOfTime.push(hour + ':' + minute);
      }
    }

    intervalsOfTime = intervalsOfTime.filter((res, index) => {
      return (index % parseInt(interval[0], 10) === 0 || index === (intervalsOfTime.length - 1))
    })

    return intervalsOfTime;
  }
  public static getIntervalV3(startTime, endTime) {

    const start = startTime.split(':');
    let intervalString = "01:00";
    let end = endTime.split(':');
    if(end[1] !== '00') {
      end[0] = Number(end[0])+1+'';
      end[1] = '00';
    }
    let hrs = ConvertUtil.getTotalHours(start.join(":"),  end.join(":"));
    if(hrs % 2 !== 0) {
      hrs = hrs+1;
    }
    if(hrs <= 10) {
      if(hrs % 2 === 0) {
        intervalString = "02:00";
      } else if(hrs % 3 === 0) {
        intervalString = "03:00";
      }
    } else {
      if(hrs % 5 === 0) {
        intervalString = "05:00";
      } else if(hrs % 4 === 0) {
        intervalString = "04:00";
      } else if(hrs % 3 === 0) {
        intervalString = "03:00";
      } else if(hrs % 2 === 0) {
        intervalString = "02:00";
      }
    }
     
    const interval = intervalString.split(':');
    const startInMinutes = start[0] * 60 + start[1] * 1;
    const endInMinutes = end[0] * 60 + end[1] * 1;
    let intervalsOfTime = [];

    if (startInMinutes === endInMinutes) {
      intervalsOfTime.push(start[0] + ':' + start[1]);
      intervalsOfTime.push(end[0] + ':' + end[1]);
     
    } else if (startInMinutes > endInMinutes) {
      for (let i = startInMinutes; i <= 24 * 60; i += 60) {
        let hour = Math.floor(i / 60) + '';
        let minute = i % 60 + '';
        minute = (minute.length < 2) ? '0' + minute : minute;
        hour = (hour.length < 2) ? '0' + hour : hour;
        intervalsOfTime.push(hour + ':' + minute);
      }

      for (let i = 60; i <= endInMinutes; i += 60) {
        let hour = Math.floor(i / 60) + '';
        let minute = i % 60 + '';
        minute = (minute.length < 2) ? '0' + minute : minute;
        hour = (hour.length < 2) ? '0' + hour : hour;
        intervalsOfTime.push(hour + ':' + minute);
      }

    } else {
      for (let i = startInMinutes; i <= endInMinutes + 1; i += 60) {
        let hour = Math.floor(i / 60) + '';
        let minute = i % 60 + '';
        minute = (minute.length < 2) ? '0' + minute : minute;
        hour = (hour.length < 2) ? '0' + hour : hour;
        intervalsOfTime.push(hour + ':' + minute);
      }
    }

    intervalsOfTime = intervalsOfTime.filter((res, index) => {
      return (index % parseInt(interval[0], 10) === 0 || index === (intervalsOfTime.length - 1))
    })

    intervalsOfTime.pop();
    let last =  intervalsOfTime[intervalsOfTime.length-1].split(':')
    intervalsOfTime.push((Number(last[0]) + Number(interval[0])) + ':' + (interval[1]))
    // if(Number(last[0] % 2 !== 0)) {
    //   last[0] = Number(last[0]) + 1 + '';
    //   last[0] = Number(last[0]) < 10 ? '0' + Number(last[0]) : Number(last[0]) + '';
    //   intervalsOfTime[intervalsOfTime.length-1] = last.join(':');
    // }

    return intervalsOfTime;
  }


  public static getHoursDifferenceV2(startTime: string, endTime: string) {
    
    const start = startTime.split(':');
    const end = endTime.split(':');
    let hours: number;
    if (start[0] === end[0]) {
      hours = 24;
    } else if (start[0] > end[0]) {
      hours = (24 - parseInt(start[0], 10));
      hours = hours + (12 - parseInt(end[0], 10));
    } else {
      hours = Math.abs(parseInt(start[0], 10) - parseInt(end[0], 10));
    }

    return hours;
  }
  public static getHoursDifference(startTime: string, endTime: string) {
    
    const start = startTime.split(':');
    let end = endTime.split(':');
    if(end[1] !== '00') {
      end[0] = Number(end[0])+1+'';
      end[1] = '00';
    }
    let hours: number;
    if (start[0] === end[0]) {
      hours = 1;
    } else if (start[0] > end[0]) {
      hours = (24 - parseInt(start[0], 10));
      hours = hours + (12 - parseInt(end[0], 10));
    } else {
      hours = Math.abs(parseInt(start[0], 10) - parseInt(end[0], 10));
    }

    return hours;
  }

  public static getUniqueArrays(myArray, toRemove, compareValue) {
    for (let i = myArray.length - 1; i >= 0; i--) {
      for (let j = 0; j < toRemove.length; j++) {
        if (myArray[i] && (myArray[i][compareValue] === toRemove[j][compareValue])) {
          myArray.splice(i, 1);
        }
      }
    }

    return myArray;

  }

  public static getPreviousDate(date, offset: number) {
    const dateOffset = (24 * 60 * 60 * 1000) * offset; // 5 days
    const previousDate = date;
    previousDate.setTime(previousDate.getTime() - dateOffset);

    return previousDate;
  }

  public static getPercentageVal(val) {
    if (val) {
      return (val * 100).toFixed(2);
    }
    return 0;
  }

  public static getPercentage(val) {
    if (val) {
      return ((val * 100).toFixed(1).toString()) + '%';
    }
    return '';
  }
}

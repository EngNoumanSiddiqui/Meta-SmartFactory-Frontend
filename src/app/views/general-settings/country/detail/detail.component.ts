import { Component, OnInit, Input, Output, EventEmitter, ɵConsole } from '@angular/core';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { CountryService } from 'app/services/dto-services/country/country.service';

@Component({
  selector: 'country-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class CountryDetailComponent implements OnInit {
  cntReqDto = {
    countryId: null,
    countryName: null,
    countryShortName: null
  };
  @Input('data') set dtcnt(data) {
    if (data) {
      console.log(data)
      this.cntReqDto = {
        countryId: data.countryId,
        countryName: data.countryName,
        countryShortName: data.countryShortName
      };
    }
  }

  @Input('id') set country(id){
    if(id){
      this.countryService.getIdNameList().then((res:any)=>{
        if(res){
          let data = res.filter((element) => element.countryId == id);
          this.cntReqDto = {
            countryId: data[0].countryId,
            countryName: data[0].countryName,
            countryShortName: data[0].countryShortName
          };
        }
      });
    }

  }
  constructor(
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private countryService: CountryService
              ) {
              }  

  ngOnInit() {}
}

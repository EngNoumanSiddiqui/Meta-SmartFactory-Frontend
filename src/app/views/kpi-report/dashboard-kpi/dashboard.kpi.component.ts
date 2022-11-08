import { Component } from "@angular/core";

@Component({
    selector: 'dashbaord-kpi',
    templateUrl: './dashboard.kpi.component.html',
    styles: [`
    .t-schedule{
        background: #f2f2f2;
        padding: 5px; 
        display:flex;
        min-height: 325px;
        max-height: 325px;
    }
    .t-schedule .pi{
        font-size: 2em; 
        color:#9999a9
    }
    .t-range{
        color: #9999a9;
    }.v-base{
        vertical-align: baseline;
    }.break-line{
        box-sizing: content-box;
        height: 0;
        overflow: visible;
        margin-left: 35%;
        margin-right: 35%;
        margin-bottom: 10px;
        border-top: 1px solid rgb(1 130 114);
    }
    .t-average{
        font-weight: 500;
        text-align: center;
        font-size: 12px;
        color: #9999a9;
    }
    .t-percentage{
        font-size: 2em;
        margin-bottom:0px
    }
    .t-blue{
        color: #147c8c !important;
    }.t-green{
        color: #669c3a !important;
    }
    .t-orange{
        color: #f8941c !important;
    }.t-red{
        color: #d7301e !important;
    }.prod p{
        margin-bottom: 3px;
    }
    `]
})

export class DashboardKpiComponent {

}
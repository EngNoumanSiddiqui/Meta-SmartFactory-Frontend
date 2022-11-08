import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DhtmlGanttChartComponent } from './dhtml-gantt-chart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DhtmlGanttChartComponent],
  exports: [DhtmlGanttChartComponent]
})
export class DhtmlGanttChartModule { }

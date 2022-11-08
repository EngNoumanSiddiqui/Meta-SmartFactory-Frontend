import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
// import 'dhtmlx-gantt';
import * as moment from 'moment';
import { gantt } from 'dhtmlx-gantt';
import { LoaderService } from 'app/services/shared/loader.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'dhtml-gantt-chart',
	styleUrls: ['./dhtml-gantt-chart.component.scss'],
	template: `<div #gantt_here class='gantt-chart'></div>`,
})
export class DhtmlGanttChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
	@ViewChild('gantt_here') ganttContainer: ElementRef<HTMLDivElement>;

  @Output() onTaskCreate = new EventEmitter<any>();
  @Output() onTaskUpdate = new EventEmitter<any>();
  @Output() onTaskDelete = new EventEmitter<any>();

  @Output() onLinkCreate = new EventEmitter<any>();
  @Output() onLinkUpdate = new EventEmitter<any>();
  @Output() onLinkDelete = new EventEmitter<any>();

  @Input('tasks') tasks: any;
  @Input('links') links: any;
  @Input('scaleView') scaleView = [
	{ unit: "month", step: 1, format: "%F, %Y"},
	{ unit: "day", step: 1, format: "%d, %D"},
  ];

  zoomConfig = {
	levels: [
	  {
		name:"day",
		scale_height: 27,
		min_column_width:80,
		scales:[
			{unit: "day", step: 1, format: "%d %M"}
		]
	  },
	  {
		 name:"week",
		 scale_height: 50,
		 min_column_width:50,
		 scales:[
		  {unit: "week", step: 1, format: function (date) {
		   var dateToStr = gantt.date.date_to_str("%d %M");
		   var endDate = gantt.date.add(date, 6, "day");
		   var weekNum = gantt.date.date_to_str("%W")(date);
		   return "#" + weekNum + ", " + dateToStr(date) + " - " + dateToStr(endDate);
		   }},
		   {unit: "day", step: 1, format: "%j %D"}
		 ]
	   },
	   {
		 name:"month",
		 scale_height: 50,
		 min_column_width:120,
		 scales:[
			{unit: "month", format: "%F, %Y"},
			{unit: "week", format: "Week #%W"}
		 ]
		},
		{
		 name:"quarter",
		 height: 50,
		 min_column_width:90,
		 scales:[
		  {unit: "month", step: 1, format: "%M"},
		  {
		   unit: "quarter", step: 1, format: function (date) {
			var dateToStr = gantt.date.date_to_str("%M");
			var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
			return dateToStr(date) + " - " + dateToStr(endDate);
		   }
		 }
		]},
		{
		  name:"year",
		  scale_height: 50,
		  min_column_width: 30,
		  scales:[
			{unit: "year", step: 1, format: "%Y"}
		]}
	]
	};

	textFilter = "<input data-text-filter type='text' oninput='doFilter(this.value)'  />";
	filteredValue: any;

	constructor(private loaderService: LoaderService) { }

	ngOnInit() {

	
		// Promise.all([this.taskService.get(), this.linkService.get()])
		// 	.then(([data, links]) => {
		// 		gantt.parse({ data, links });
		// 	});
	}

	doFilter(value) {
		this.filteredValue = value;
		// setTimeout(() => {
		// 	gantt.render();
			
		// }, 200);
	}

  ngAfterViewInit() {
    this.buildGantt();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
	  if(simpleChanges.scaleView && simpleChanges.scaleView.currentValue) {
		gantt.config.scales = [...this.scaleView];
		gantt.render();
	  }
	  if(simpleChanges.links && simpleChanges.links.currentValue) {
		if(this.ganttContainer) {
			gantt.clearAll();
			this.buildGantt();
		}
	  }
  }
  ngOnDestroy() {
	  gantt.clearAll();
  }


  buildGantt() {
	gantt.config.xml_date = '%Y-%m-%d %H:%i';
	// gantt.$doFilter = function(value) {
	// 	this.filteredValue = value;
	// 	// setTimeout(() => {
	// 	// 	gantt.render();
			
	// 	// }, 200);
	// }
	gantt.config.columns=[
		{name:"text", label:'Name', tree:true, min_width:130 ,resize:true,align:'left'},
		{name:"start_date", label:"Start time", min_width:110, align: "center", resize:true},
		{name:"end_date", label:"End time", min_width:110, align: "center", resize:true },
		// {name:"duration",   label:"Duration",   align: "center" },
		// {name:"add",        label:"" }
	];
	gantt.plugins({ 
        tooltip: true ,
		marker: true,
    });
	gantt.addMarker({
		start_date: new Date(), //a Date object that sets the marker's date
		css: "today", //a CSS class applied to the marker
		text: "Now", //the marker title
		title: gantt.date.date_to_str(gantt.config.task_date)
	});
	gantt.config.drag_resize = false;
	gantt.config.scales = [...this.scaleView];
	// gantt.attachEvent("onBeforeTaskDisplay",(id, task) => {
	// 	if(!this.filteredValue) return true;
	
	// 		var normalizedText = task.text.toLowerCase();
	// 		var normalizedValue = this.filteredValue.toLowerCase();
	// 		return normalizedText.indexOf(normalizedValue) > -1;
	// 	}, null);
	// [
	// 	{unit: "month", step: 1, format: "%F, %Y"},
	// 	// {unit: "day", step: 1, format: "%j, %D"}
	// ];
	gantt.templates.scale_cell_class = function(date){
		if(date.getDay()==0||date.getDay()==6){
			return "weekend";
		}
	};
	gantt.templates.timeline_cell_class = function(task,date){
		if(date.getDay()==0||date.getDay()==6){ 
			return "weekend" ;
		}
	};
	gantt.templates.tooltip_text = function(start,end,task){
		return "<b>Task:</b> "+task.desc
		+"<br/><b>Type:</b> "+task.type
		+"<br/><b>Start:</b> " + moment(start).format('YYYY-MM-DD HH:mm:ss')
		+"<br/><b>End:</b> " + moment(end).format('YYYY-MM-DD HH:mm:ss');
	};

	

	gantt.attachEvent("onTaskDblClick", (id: any,e: any) => {
		const task  = gantt.getTask(id);
		if(task) {
			if(task.type === 'project') {
				const projectId = task.id.replace("PR", "");
				this.loaderService.showDetailDialog(DialogTypeEnum.PROJECT, Number(projectId));
				return false;
			} else if(task.type === 'customMilestone') {
				const milestoneId = task.id.replace("ML", "");
				this.loaderService.showDetailDialog(DialogTypeEnum.MILESTONE, Number(milestoneId));
				return false;
			} else if(task.type === 'prodorder') {
				const prodId = task.id.replace("PR", "");
				this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTIONORDER, Number(prodId));
				return false;
			}  else if(task.type === 'task') {
				const prodId = task.id.replace("PRT", "");
				this.loaderService.showDetailDialog(DialogTypeEnum.PROJECTTASK, Number(prodId));
				return false;
			} else if(task.type === 'JOBORDEROPERATION') {
				const prodId = task.id.replace("JBOP", "");
				this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, Number(prodId));
				return false;
			} else {
				return false;
			}
		}
	}, null);


	gantt.init(this.ganttContainer.nativeElement);



	const dp = gantt.createDataProcessor({
		task: {
			update: (data:any) => this.onTaskUpdate.emit(data),
			create: (data:any) => this.onTaskCreate.emit(data),
			delete: (id) => this.onTaskDelete.emit(id)
		},
		link: {
			update: (data:any) => this.onLinkUpdate.emit(data),
			create: (data:any) => this.onLinkCreate.emit(data),
			delete: (id) => this.onLinkDelete.emit(id)
		}
	});
	dp.init(gantt);
	dp.setTransactionMode("REST");
    gantt.parse({data: this.tasks, links: this.links});
  }
}
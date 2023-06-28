import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'daily-tasks',
    templateUrl: './daily-tasks.component.html',
})
export class DailyTasksComponent implements OnInit{
    @Output() hide_component: EventEmitter<any> = new EventEmitter<any>();

    constructor(){

    }
    ngOnInit(){

    }

    // close() {
	// 	this.hide_component.emit("4");
	// };
}
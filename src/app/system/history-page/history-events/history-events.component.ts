import { Component, Input, OnInit } from '@angular/core';
import { WFMEvent } from '../../shared/models/event.model';
import { Category } from '../../shared/models/category.model';

@Component({
    selector: 'wfm-history-events',
    templateUrl: './history-events.component.html',
    styleUrls: ['./history-events.component.less']
})
export class HistoryEventsComponent implements OnInit {
	@Input() categories: Category[] = [];
	@Input() events: WFMEvent[] = [];

    searchValue ='';
    searchPlaceholder = 'Сумма';
    searchField = 'amount';

    constructor() { }

    ngOnInit() {
    	this.events.forEach((e) => {
    		e.catName = this.categories.find(c => c.id === e.category).name;
    	})
    }

    getEventClass(e: WFMEvent) {
    	return {
    		'btn btn-sm': true,
    		'btn-danger': e.type === 'outcome',
    		'btn-success': e.type === 'income'
    	}
    }

    changeCriteria(field: string) {
        const namesMap = {
            amount: 'Сумма',
            date: 'Дата',
            category: 'Категория',
            type: 'Тип'
        };
        this.searchPlaceholder = namesMap[field];
        this.searchField = field;
    }

}

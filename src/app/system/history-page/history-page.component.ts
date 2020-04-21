import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from "rxjs/index";
import * as moment from 'moment';

import { CategoriesService } from '../shared/services/categories.service';
import { EventsService } from '../shared/services/events.service';
import { Category } from '../../shared/models/category.model';
import { WFMEvent } from '../../shared/models/event.model';

@Component({
    selector: 'wfm-history-page',
    templateUrl: './history-page.component.html',
    styleUrls: ['./history-page.component.less']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

    constructor(
  	    private categoriesService: CategoriesService,
  	    private eventService: EventsService
  	) { }

    isLoaded = false;
    s1: Subscription;

    categories: Category[] = [];
    events: WFMEvent[] = [];
    filteredEvents: WFMEvent[] = [];

    chartData = [];

    isFilterVisible = false;

    ngOnInit() {
  	    this.s1 = combineLatest(
                    this.categoriesService.getCategories(),
                    this.eventService.getEvents()
  	                ).subscribe((data: [Category[], WFMEvent[]]) => {
                        this.categories = data[0];
                        this.events = data[1];

                        this.setOriginalEvents();
                        this.calculateChartData();

                        this.isLoaded = true;
                        console.log(this.isLoaded);
  	              });

    }

    private setOriginalEvents() {
        this.filteredEvents = this.events.slice();
    }

    calculateChartData(): void {
    	this.chartData = [];

    	this.categories.forEach((cat) => {
    		const catEvent = this.filteredEvents.filter((e) => e.category === cat.id && e.type === 'outcome');
    	    this.chartData.push({
    	    	name: cat.name,
    	    	value: catEvent.reduce((total, e) => {
    	    		total +=e.amount;
    	    		return total;
    	    	}, 0)
    	    });
    	});    	console.log(this.chartData);

    }

    private toggleFilterVisibility(dir: boolean) {
        this.isFilterVisible = dir;
    }

    openFilter() {
        this.toggleFilterVisibility(true);
    }

    onFilterApply(filterData) {
        this.toggleFilterVisibility(false);
        this.setOriginalEvents();

        const startPeriod = moment().startOf(filterData.period).startOf('d');
        const endPeriod = moment().endOf(filterData.period).endOf('d');

        this.filteredEvents = this.filteredEvents
            .filter((e) => {
                return filterData.types.indexOf(e.type) !== -1;
            })
            .filter((e) => {
                return filterData.categories.indexOf(e.category.toString()) !== -1;
            })
            .filter((e) => {
                const momentDate = moment(e.date, 'DD.MM.YYYY HH:mm:ss');
                return momentDate.isBetween(startPeriod, endPeriod);
            });

        this.calculateChartData();
    }

    onFilterCancel() {
        this.toggleFilterVisibility(false);
        this.setOriginalEvents();
        this.calculateChartData();

    }

    ngOnDestroy() {
    	if (this.s1) {
    		this.s1.unsubscribe();
    	}
    }

}

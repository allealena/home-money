import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { EventsService } from '../../shared/services/events.service';
import { CategoriesService } from '../../shared/services/categories.service';
import { Category } from '../../shared/models/category.model';
import { WFMEvent } from '../../shared/models/event.model';

@Component({
    selector: 'wfm-history-detail',
    templateUrl: './history-detail.component.html',
    styleUrls: ['./history-detail.component.less']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

	event: WFMEvent;
	category: Category;
    
    isLoaded = false;
    s1: Subscription;
    
    constructor(
      private route: ActivatedRoute,
      private eventsService: EventsService,
      private categoriesService: CategoriesService
  	  ) { }

    ngOnInit() {
  	    this.s1 = this.route.params
  	        .pipe(
                mergeMap((params: Params) => this.eventsService.getEventById(params['id'])) )
  	        .pipe(
                mergeMap((event: WFMEvent) => {
            	    this.event = event;
            	    return this.categoriesService.getCategoryById(event.category);
                }) )
  	        .subscribe((category: Category) => {
                    this.category = category;
                    this.isLoaded = true;
  	          })
    }

    ngOnDestroy() {
    	if (this.s1) {
    		this.s1.unsubscribe();
    	}
    }
}

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { form } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Category } from '../../shared/models/category.model';
import { CategoriesService } from '../../shared/services/categories.service';
import { Message } from '../../../shared/models/message.model';

@Component({
    selector: 'wfm-edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.less']
})
export class EditCategoryComponent implements OnInit, OnDestroy {
    @Input() categories: Category[] = [];
    @Output() onCategoryEdit = new EventEmitter<Category>();

    currentCategoryId = 1;
    currentCategory: Category;
    message: Message;

    sub1: Subscription;
    
    constructor(
        private categoriesService: CategoriesService
    ) { }

    ngOnInit() {
    	this.message = new Message('success', '');
    	this.onCategoryChange();
    }

    onCategoryChange () {
        this.currentCategory = this.categories
            .find(c => c.id === +this.currentCategoryId);
    }

    onSubmit (form: ngForm) {
        let {capacity, name} = form.value;
        if (capacity < 0) {
            capacity *= -1 ;
        }

        const category = new Category(name, capacity, +this.currentCategoryId);

        this.sub1 = this.categoriesService.updateCategory(category)
                        .subscribe((category: Category) => {
            	            this.onCategoryEdit.emit(category);
            	            this.message.text = 'Категория успешно отредактирована.';
            	            window.setTimeout(() => this.message.text = '', 5000);
                        });

    }

     ngOnDestroy() {
        if (this.sub1) {
            this.sub1.unsubscribe()
        };
    }

}

import { Component, OnInit } from '@angular/core';
import { CoCategoryService } from '../services/coService/co_category_subcategory.service'


@Component({
  selector: 'app-sio-information-service',
  templateUrl: './sio-information-service.component.html',
  styleUrls: ['./sio-information-service.component.css']
})
export class SioInformationServiceComponent implements OnInit {

	// categoryList: any;
	// subCategoryList: any;
	// symptomCategory: any;
	// symptomSubCategory: any;
	// detailsList: any;
	constructor(private _coCategoryService: CoCategoryService) {
	}

	ngOnInit() {
		// this._coCategoryService.getCategories()
		// 	.subscribe(response => this.SetCategories(response));
	}

	// SetCategories(response: any) {
	// 	console.log('success', response);
	// 	this.categoryList = response;
	// }

	// GetSubCategories(id: any) {
	// 	// console.log('symcatid',this.symptomCategory);
	// 	this._coCategoryService.getSubCategories(id)
	// 		.subscribe(response => this.SetSubCategories(response));
	// }

	// SetSubCategories(response: any) {
	// 	console.log('success', response);
	// 	this.subCategoryList = response;
	// }

	// GetSubCategoryDetails(id: any) {
	// 	this._coCategoryService.getDetails(id, "neer", 123, 1, 3, 1)
	// 		.subscribe(response => this.SetSubCategoryDetails(response));
	// }

	// SetSubCategoryDetails(response: any) {
	// 	console.log('success', response);
	// 	this.detailsList = response;
	// }

}

/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


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

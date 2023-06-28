import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SupervisorConfigurationsComponent } from './supervisor-configurations.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Md2Module } from 'md2';
import { FormsModule } from "@angular/forms";


let component: SupervisorConfigurationsComponent;
let fixture: ComponentFixture<SupervisorConfigurationsComponent>;


function Initialize104TestBed() {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupervisorConfigurationsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [Md2Module, FormsModule],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
}
describe('Supervisor-configurations-component', () => {

  fdescribe('When the component is getting loaded, then ngOninit', () => {

    Initialize104TestBed();

    it('should be created', () => {
      expect(component).toBeTruthy();
    });
    it('should be defined', () => {
      expect(component).toBeDefined();
    });

  });

});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WivPlanviewerComponent } from './wiv-planview.component';

describe('IfcPropertiesComponent', () => {
  let component: WivPlanviewerComponent;
  let fixture: ComponentFixture<WivPlanviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WivPlanviewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WivPlanviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

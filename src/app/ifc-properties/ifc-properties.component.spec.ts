import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfcPropertiesComponent } from './ifc-properties.component';

describe('IfcPropertiesComponent', () => {
  let component: IfcPropertiesComponent;
  let fixture: ComponentFixture<IfcPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfcPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IfcPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsfBuildingComponentsComponent } from './bsf-building-components.component';

describe('BsfBuildingComponentsComponent', () => {
  let component: BsfBuildingComponentsComponent;
  let fixture: ComponentFixture<BsfBuildingComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BsfBuildingComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BsfBuildingComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

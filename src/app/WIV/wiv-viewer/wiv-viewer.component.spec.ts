import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WivViewerComponent } from './wiv-viewer.component';

describe('WivViewerComponent', () => {
  let component: WivViewerComponent;
  let fixture: ComponentFixture<WivViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WivViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WivViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyManagerComponent } from './property-manager.component';

describe('PropertyManagerComponent', () => {
  let component: PropertyManagerComponent;
  let fixture: ComponentFixture<PropertyManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

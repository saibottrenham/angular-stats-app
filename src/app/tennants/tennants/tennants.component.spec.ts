import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TennantsComponent } from './tennants.component';

describe('TennantsComponent', () => {
  let component: TennantsComponent;
  let fixture: ComponentFixture<TennantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TennantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TennantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

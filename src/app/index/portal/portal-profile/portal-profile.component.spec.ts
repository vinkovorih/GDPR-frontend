import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalProfileComponent } from './portal-profile.component';

describe('PortalProfileComponent', () => {
  let component: PortalProfileComponent;
  let fixture: ComponentFixture<PortalProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepsComponent } from './deps.component';

describe('DepsComponent', () => {
  let component: DepsComponent;
  let fixture: ComponentFixture<DepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

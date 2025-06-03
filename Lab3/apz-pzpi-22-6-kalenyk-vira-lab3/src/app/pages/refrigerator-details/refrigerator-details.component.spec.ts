import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefrigeratorDetailsComponent } from './refrigerator-details.component';

describe('RefrigeratorDetailsComponent', () => {
  let component: RefrigeratorDetailsComponent;
  let fixture: ComponentFixture<RefrigeratorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefrigeratorDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefrigeratorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

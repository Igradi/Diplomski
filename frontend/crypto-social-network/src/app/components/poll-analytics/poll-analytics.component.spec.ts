import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollAnalyticsComponent } from './poll-analytics.component';

describe('PollAnalyticsComponent', () => {
  let component: PollAnalyticsComponent;
  let fixture: ComponentFixture<PollAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollAnalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PollAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

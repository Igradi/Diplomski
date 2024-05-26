import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfCoinsComponent } from './list-of-coins.component';

describe('ListOfCoinsComponent', () => {
  let component: ListOfCoinsComponent;
  let fixture: ComponentFixture<ListOfCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfCoinsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

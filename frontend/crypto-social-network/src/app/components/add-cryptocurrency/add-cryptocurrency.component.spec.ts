import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCryptocurrencyComponent } from './add-cryptocurrency.component';

describe('AddCryptocurrencyComponent', () => {
  let component: AddCryptocurrencyComponent;
  let fixture: ComponentFixture<AddCryptocurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCryptocurrencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCryptocurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

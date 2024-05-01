import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptocurrencyListComponent } from './cryptocurrency-list.component';

describe('CryptocurrencyListComponent', () => {
  let component: CryptocurrencyListComponent;
  let fixture: ComponentFixture<CryptocurrencyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptocurrencyListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CryptocurrencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

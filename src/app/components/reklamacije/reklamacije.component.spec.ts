import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReklamacijeComponent } from './reklamacije.component';

describe('ReklamacijeComponent', () => {
  let component: ReklamacijeComponent;
  let fixture: ComponentFixture<ReklamacijeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReklamacijeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReklamacijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

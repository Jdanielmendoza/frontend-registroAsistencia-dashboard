import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgAcademicaComponent } from './prog-academica.component';

describe('ProgAcademicaComponent', () => {
  let component: ProgAcademicaComponent;
  let fixture: ComponentFixture<ProgAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgAcademicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

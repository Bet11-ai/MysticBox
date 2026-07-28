import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPromocionesPage } from './admin-promociones.page';

describe('AdminPromocionesPage', () => {
  let component: AdminPromocionesPage;
  let fixture: ComponentFixture<AdminPromocionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPromocionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

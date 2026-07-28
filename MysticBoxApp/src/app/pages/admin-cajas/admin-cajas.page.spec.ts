import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCajasPage } from './admin-cajas.page';

describe('AdminCajasPage', () => {
  let component: AdminCajasPage;
  let fixture: ComponentFixture<AdminCajasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCajasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

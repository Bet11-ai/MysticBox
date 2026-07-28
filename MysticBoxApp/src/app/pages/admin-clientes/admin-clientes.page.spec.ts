import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminClientesPage } from './admin-clientes.page';

describe('AdminClientesPage', () => {
  let component: AdminClientesPage;
  let fixture: ComponentFixture<AdminClientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

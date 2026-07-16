import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcesoCompraPage } from './proceso-compra.page';

describe('ProcesoCompraPage', () => {
  let component: ProcesoCompraPage;
  let fixture: ComponentFixture<ProcesoCompraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesoCompraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

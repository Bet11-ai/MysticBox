import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminWhitelistPage } from './admin-whitelist.page';

describe('AdminWhitelistPage', () => {
  let component: AdminWhitelistPage;
  let fixture: ComponentFixture<AdminWhitelistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminWhitelistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

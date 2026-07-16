import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MysticboxPage } from './mysticbox.page';

describe('MysticboxPage', () => {
  let component: MysticboxPage;
  let fixture: ComponentFixture<MysticboxPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MysticboxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

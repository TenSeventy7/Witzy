import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LevelStartComponent } from './level-start.component';

describe('LevelStartComponent', () => {
  let component: LevelStartComponent;
  let fixture: ComponentFixture<LevelStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelStartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LevelStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

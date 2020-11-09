import { TestBed, waitForAsync} from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ParticleEffectButtonModule } from 'angular-particle-effect-button';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [BrowserModule, ParticleEffectButtonModule],
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Angular Particle Effects for Buttons');
  }));

});

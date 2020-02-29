import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ParticleEffectButtonDirective } from './angular-particle-effect-button.directive';
import { isFunction } from './utils';

@Component({
  selector: 'lib-test-component',
  template: `
    <button libParticleEffectButton (click)="hidden0=!hidden0">Send</button>
  `,
})
class TestParticleEffectButtonComponent {
  public hidden0 = false;
}

describe('AngularParticleEffectButtonComponent', () => {
  let component: TestParticleEffectButtonComponent;
  let fixture: ComponentFixture<TestParticleEffectButtonComponent>;
  let directiveDOM: DebugElement;
  let directiveChildWrapper: DebugElement;
  let directiveParentWrapper: DebugElement;
  let canvas: Array<DebugElement>;
  let defaultOptions: any;
  let originalTimeout: number;

  const noop = () => {
  };

  const initializeDefaultOptions = () => {
    defaultOptions = {
      pColor: '#000',
      pDuration: 1000,
      pEasing: 'easeInOutCubic',
      pType: 'circle',
      pStyle: 'fill',
      pDirection: 'left',
      pCanvasPadding: 150,
      pOscillationCoefficient: 30,
      pParticlesAmountCoefficient: 3,
    };
  };

  let options: any;
  const initializeOptions = () => {
    options = {
      pColor: '#001',
      pDuration: 1001,
      pEasing: 'easeInOut',
      pType: 'rectangle',
      pStyle: 'stroke',
      pDirection: 'right',
      pCanvasPadding: 1520,
      pSize: () => 0.7 * 24,
      pSpeed: 2,
      pOscillationCoefficient: 410,
      pParticlesAmountCoefficient: 33,
      pBegin: noop,
      pComplete: noop,
    };
  };

  beforeEach(async(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    TestBed.configureTestingModule({
      declarations: [ParticleEffectButtonDirective, TestParticleEffectButtonComponent],
    });
  }));

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestParticleEffectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    directiveDOM = fixture.debugElement.query(By.directive(ParticleEffectButtonDirective));
    directiveChildWrapper = directiveDOM.parent;
    directiveParentWrapper = directiveChildWrapper.parent;
    canvas = directiveParentWrapper.queryAll(By.css('canvas'));
  });

  it('should create directive', () => {
    expect(directiveDOM).toBeTruthy();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a child wrapper containing the original button with proper styles', () => {
    expect(directiveChildWrapper).toBeTruthy();
    expect(directiveChildWrapper.styles.position).toEqual('relative');
    expect(directiveChildWrapper.styles.display).toEqual('inline-block');
    expect(directiveChildWrapper.styles.overflow).toEqual('hidden');
  });

  it('should have a parent wrapper containing the child wrapper and a canvas with proper styles', () => {
    expect(directiveParentWrapper).toBeTruthy();
    expect(directiveParentWrapper.styles.position).toEqual('relative');
    expect(directiveParentWrapper.styles.display).toEqual('inline-block');
  });

  it('should have a canva with proper styles', () => {
    expect(canvas.length).toBe(1);

    const styles = canvas[0].styles;
    expect(styles.position).toEqual('absolute');
    expect(styles['pointer-events']).toEqual('none');
    expect(styles.top).toEqual('50%');
    expect(styles.left).toEqual('50%');
    expect(styles.transform).toEqual('translate3d(-50%, -50%, 0px)');
    expect(styles.display).toEqual('none');
  });

  it('should have default values already set', () => {
    initializeDefaultOptions();
    const directiveInstance = directiveDOM.injector.get(ParticleEffectButtonDirective) as ParticleEffectButtonDirective;
    Object.keys(defaultOptions).forEach(key => {
      expect(defaultOptions[key]).toEqual(directiveInstance[key]);
    });
  });

  it('should begin event emit when animation starts', (done) => {
    initializeDefaultOptions();
    const directiveInstance = directiveDOM.injector.get(ParticleEffectButtonDirective) as ParticleEffectButtonDirective;
    directiveInstance.pBegin.subscribe(() => {
      expect(true).toBe(true);
      done();
    });
    directiveInstance.pHidden = true;
    fixture.detectChanges();
  });

  it('should complete event emit when animation completes', (done) => {
    initializeDefaultOptions();
    const directiveInstance = directiveDOM.injector.get(ParticleEffectButtonDirective) as ParticleEffectButtonDirective;
    directiveInstance.pComplete.subscribe(() => {
      expect(true).toBe(true);
      done();
    });
    directiveInstance.pHidden = true;
    fixture.detectChanges();
  });

  it('should pOptions return actual options', () => {
    initializeOptions();
    const directiveInstance = directiveDOM.injector.get(ParticleEffectButtonDirective) as ParticleEffectButtonDirective;
    directiveInstance.pOptions = options;
    fixture.detectChanges();
    const directiveOptions = directiveInstance.pOptions;
    Object.keys(directiveOptions).forEach(key => {
      if (isFunction(options[key])) {
        expect(options[key]).toBe(directiveOptions[key]);
      } else {
        expect(options[key]).toEqual(directiveOptions[key]);
      }
    });
  });

  it('should not allow to set private props', () => {
    initializeOptions();
    const directiveInstance = directiveDOM.injector.get(ParticleEffectButtonDirective) as ParticleEffectButtonDirective;
    directiveInstance.pOptions = {_particles: 'foo'};
    expect((directiveInstance as any)._particles).not.toBe('foo');
    fixture.detectChanges();

  });
});


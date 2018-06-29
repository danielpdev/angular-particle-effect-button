import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ParticleEffectButtonDirective } from './angular-particle-effect-button.directive';
import { IOption } from './particles';
import { is, rand } from './utils';

@Component({
  selector:'test-component',
  template: `
			<button libParticleEffectButton (click)="hidden0=!hidden0">Send</button>
	` 
}) 
class TestParticleEffectButtonComponent {
}

describe('AngularParticleEffectButtonComponent', () => {
  let component: TestParticleEffectButtonComponent;
  let fixture: ComponentFixture<TestParticleEffectButtonComponent>;
	let directiveDOM: DebugElement;
	let divs: Array<DebugElement>;
	let directiveChildWrapper: Array<DebugElement>;
	let canvas: Array<DebugElement>;
	let defaultOptions: any;
	let originalTimeout: number;
	
	const noop = () => {}
	
	const initializeDefaultOptions = () => {
		defaultOptions = {
			pColor: '#000',
			pDuration: 1000,
			pEasing:'easeInOutCubic',
			pType:'circle',
			pStyle: 'fill',
			pDirection:'left',
			pCanvasPadding: 150,
			pOscillationCoefficient: 30,
			pParticlesAmountCoefficient: 3
		};
	}
	 
	let options: any; 
	const initializeOptions = () => {
			options = {
				pColor: '#001',
				pDuration: 1001, 
				pEasing:'easeInOut',
				pType:'rectangle',
				pStyle: 'stroke',
				pDirection:'right',
				pCanvasPadding: 1520,
				pSize: () => 0.7 * 24,
				pSpeed: 2,
				pOscillationCoefficient: 410,
				pParticlesAmountCoefficient: 33,
				pBegin: noop,
				pComplete: noop 
			}
	};
	
  beforeEach(async(() => {
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		
    TestBed.configureTestingModule({
      declarations: [ParticleEffectButtonDirective, TestParticleEffectButtonComponent ]
    });
  }));
	
 	afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
 	});
	
	beforeEach(() => { 
    fixture = TestBed.createComponent(TestParticleEffectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    directiveDOM = fixture.debugElement.query(By.directive(ParticleEffectButtonDirective));
		directiveChildWrapper = directiveDOM.queryAll(By.css("div[style='position: relative; display: inline-block; overflow: hidden;']"));
		canvas = directiveDOM.queryAll(By.css("canvas[style='position: absolute; pointer-events: none; top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0px); display: none;']"));
  }); 

	it('should create directive', () => {
    expect(directiveDOM).toBeTruthy();
  });
	
  it('should create component', () => {
    expect(component).toBeTruthy();
  });
	
	it('should contain 1 div and 1 canvas with proper styles', () => {
    expect(directiveChildWrapper.length).toBe(1);
		expect(canvas.length).toBe(1);
	});
	
	it('should have directive top parent with proper styles', () => {
    expect(directiveDOM.styles).toEqual({ position: 'relative', display: 'inline-block' });
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
		directiveInstance.pBegin.subscribe(()=>{
			done();
		});
		directiveInstance.pHidden = true; 
		fixture.detectChanges();
	});
	
	it('should complete event emit when animation completes', (done) => {
		initializeDefaultOptions();
		const directiveInstance = directiveDOM.injector.get(ParticleEffectButtonDirective) as ParticleEffectButtonDirective;
		directiveInstance.pComplete.subscribe(()=>{
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
		Object.keys(directiveOptions).forEach(key=>{
			if (is.fnc(options[key])) { 
				expect(options[key]).toBe(directiveOptions[key]);
			} else {
				expect(options[key]).toEqual(directiveOptions[key]);
			}
		});
	});
	
	it('should not allow to set private props', (done) => {
		initializeOptions();
		const directiveInstance = directiveDOM.injector.get(ParticleEffectButtonDirective) as ParticleEffectButtonDirective;
		directiveInstance.pOptions = {_particles: {}};
		directiveInstance.pBegin.subscribe(()=>{
			done();
		});
		directiveInstance.pHidden = true; 
		fixture.detectChanges();

	});
}); 


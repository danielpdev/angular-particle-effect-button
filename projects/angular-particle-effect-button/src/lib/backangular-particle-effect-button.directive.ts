import {
  ElementRef,
  Input,
  Directive,
  EventEmitter,
  Output,
  Renderer2,
  AfterContentInit,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { Particles, IOption } from './particles';

@Directive({
  selector: '[libParticleEffectButton]'
})
export class ParticleEffectButtonDirective implements AfterContentInit, OnDestroy, OnInit {
  DEBOUNCE_TIME_BETWEEN_TRANSITIONS = 5;
  @Input() pColor = '#000';
  @Input() pDuration = 1000;
  @Input() pEasing = 'easeInOutCubic';
  @Input() pType = 'circle';
  @Input() pStyle = 'fill';
  @Input() pDirection = 'left';
  @Input() pCanvasPadding = 150;
  @Input() pSize = 4;
  @Input() pSpeed = 2;
  @Input() pOscillationCoefficient = 40;
  @Input() pParticlesAmountCoefficient = 3;
  _pHidden = false;
  @Input('pHidden')
  set pHidden(value: boolean) {
    this._pHidden = value;
    if (value && this.particles && !this.particles.isDisintegrated()) {
         this.particles.disintegrate(this.getFormattedOptions());
      } else if (!value && this.particles && this.particles.isDisintegrated()) {
         this.particles.integrate(this.getFormattedOptions());
      }
  }
  get pHidden(): boolean {
    return this._pHidden;
  }
  private pHiddenSubscription: Subscription;
  private pHiddenSubject = new Subject();
  @Output() pBegin = new EventEmitter<void>();
  @Output() pComplete = new EventEmitter<void>();
  private particles: Particles;
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.pHiddenSubscription = this.pHiddenSubject.pipe(
      debounceTime(this.DEBOUNCE_TIME_BETWEEN_TRANSITIONS)
    ).subscribe(hidden => {
//       if(hidden && !this.particles.isDisintegrated()) {
//          this.particles.disintegrate(this.getFormattedOptions());
//       }else if(!hidden && this.particles.isDisintegrated()) {
//          this.particles.integrate(this.getFormattedOptions());
//       }
    });
  }
  ngAfterContentInit() {
    this.particles = new Particles(
      this.el.nativeElement,
      this.getFormattedOptions(),
      this.renderer
    );
  }
  ngOnDestroy() {
    if (this.pHiddenSubscription) {
      this.pHiddenSubscription.unsubscribe();
    }
  }

  private getFormattedOptions(): IOption {
     return {
        color: this.pColor,
        type: this.pType,
        style: this.pStyle,
        canvasPadding: this.pCanvasPadding,
        duration: this.pDuration,
        easing: this.pEasing,
        direction: this.pDirection,
        size: () => 0.7 * this.pSize,
        speed: () => 0.7 * this.pSpeed,
        particlesAmountCoefficient: this.pParticlesAmountCoefficient,
        oscillationCoefficient: this.pOscillationCoefficient,
        begin: () => {
          this.pBegin.emit();
        },
        complete: () => {
          this.pComplete.emit();
        }
    };
  }

  public getOptions(): any {
    return {
        pColor: this.pColor,
        pType: this.pType,
        pStyle: this.pStyle,
        pCanvasPadding: this.pCanvasPadding,
        pDuration: this.pDuration,
        pEasing: this.pEasing,
        pDirection: this.pDirection,
        pSize: this.pSize,
        pSpeed: this.pSpeed,
        pParticlesAmountCoefficient: this.pParticlesAmountCoefficient,
        pOscillationCoefficient: this.pOscillationCoefficient,
        pBegin: this.pBegin,
        pComplete: this.pComplete
    };
  }

  public setOptions(options: IOption): void {
    const allowedProps = this.getOptions();
    Object.keys(options).map(key => {
      if (allowedProps[key]) {
        this[key] = options[key];
      }
    });
  }
}

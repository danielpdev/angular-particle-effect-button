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
import { rand } from './utils';
import { Particles, IOption } from './particles';

@Directive({
  selector: '[libParticleEffectButton]'
})
export class ParticleEffectButtonDirective implements AfterContentInit {
  private _particles: Particles;
  private _pHidden = false;
  @Input() pColor = '#000';
  @Input() pDuration = 1000;
  @Input() pEasing = 'easeInOutCubic';
  @Input() pType = 'circle';
  @Input() pStyle = 'fill';
  @Input() pDirection = 'left';
  @Input() pCanvasPadding = 150;
  @Input() pOscillationCoefficient = 30;
  @Input() pParticlesAmountCoefficient = 3;
  @Output() pBegin = new EventEmitter<void>();
  @Output() pComplete = new EventEmitter<void>();
  @Input() pSize: () => number | number = () => Math.floor((Math.random() * 3) + 1);
  @Input() pSpeed: () => number | number = () => rand(4);

  @Input('pHidden')
  set pHidden(value: boolean) {
    this._pHidden = value;
    if (this._particles) {
      if (value && !this._particles.isDisintegrated()) {
         this._particles.disintegrate(this.getFormattedOptions());
      } else if (!value && this._particles.isDisintegrated()) {
         this._particles.integrate(this.getFormattedOptions());
      }
    }
  }
  get pHidden(): boolean {
    return this._pHidden;
  }

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterContentInit() {
    this._particles = new Particles(
      this.el.nativeElement,
      this.getFormattedOptions(),
      this.renderer
    );
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
        size: this.pSize,
        speed: this.pSpeed,
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
  public get pOptions(): any {
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
  public set pOptions(options: any) {
    const allowedProps = this.pOptions;
    Object.keys(options).map( key => {
      if (allowedProps[key]) {
        this[key] = options[key];
      }
    });
  }
}

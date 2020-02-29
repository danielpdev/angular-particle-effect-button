import anime from 'animejs';
import { Renderer2 } from '@angular/core';
import { rand, isFunction, transformString } from './utils';

export interface IOption {
  color?: string;
  type?: string;
  style?: string;
  canvasPadding?: number;
  duration?: number;
  easing?: Array<number> | string;
  direction?: string;
  size?: (() => number) | number;
  speed?: (() => number) | number;
  particlesAmountCoefficient?: number;
  oscillationCoefficient?: number;
  begin?: () => void;
  width?: number;
  height?: number;
  complete?: () => void;
}

export class Particles {
  particles = [];
  frame = null;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  wrapper: HTMLDivElement;
  parentWrapper: HTMLDivElement;
  o: IOption;
  disintegrating: boolean;
  width: number;
  height: number;
  lastProgress: number;
  rect: HTMLCanvasElement;

  constructor(
    private el: any,
    private options: IOption,
    private renderer: Renderer2,
  ) {
    this.options = {...options};
    this.init();
  }

  init(): void {
    this.canvas = this.renderer.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.renderer.setStyle(this.canvas, 'position', 'absolute');
    this.renderer.setStyle(this.canvas, 'pointerEvents', 'none');
    this.renderer.setStyle(this.canvas, 'top', '50%');
    this.renderer.setStyle(this.canvas, 'left', '50%');
    this.renderer.setStyle(this.canvas, 'transform', 'translate3d(-50%, -50%, 0)');
    this.renderer.setStyle(this.canvas, 'display', 'none');
    this.wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(this.wrapper, 'position', 'relative');
    this.renderer.setStyle(this.wrapper, 'display', 'inline-block');
    this.renderer.setStyle(this.wrapper, 'overflow', 'hidden');
    this.renderer.insertBefore(this.el.parentNode, this.wrapper, this.el);
    this.renderer.appendChild(this.wrapper, this.el);
    this.parentWrapper = this.renderer.createElement('div');
    this.renderer.setStyle(this.parentWrapper, 'position', 'relative');
    this.renderer.setStyle(this.parentWrapper, 'display', 'inline-block');
    this.renderer.insertBefore(
      this.wrapper.parentNode,
      this.parentWrapper,
      this.wrapper,
    );
    this.renderer.appendChild(this.parentWrapper, this.wrapper);
    this.renderer.appendChild(this.parentWrapper, this.canvas);
  }

  setOptions(options) {
    this.options = {...this.options, ...options};
  }

  loop() {
    this.updateParticles();
    this.renderParticles();
    if (this.isAnimating()) {
      this.frame = requestAnimationFrame(this.loop.bind(this));
    }
  }

  updateParticles() {
    let p;
    for (let i = 0; i < this.particles.length; i++) {
      p = this.particles[i];
      if (p.life > p.death) {
        this.particles.splice(i, 1);
      } else {
        p.x += p.speed;
        p.y = this.o.oscillationCoefficient * Math.sin(p.counter * p.increase);
        p.life++;
        p.counter += this.disintegrating ? 1 : -1;
      }
    }
    if (!this.particles.length) {
      this.pause();
      this.renderer.setStyle(this.canvas, 'display', 'none');
      if (isFunction(this.o.complete)) {
        this.o.complete();
      }
    }
  }

  renderParticles() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    let p;
    for (let i = 0; i < this.particles.length; i++) {
      p = this.particles[i];
      if (p.life < p.death) {
        this.ctx.translate(p.startX, p.startY);
        this.ctx.rotate(p.angle * Math.PI / 180);
        this.ctx.globalAlpha = this.disintegrating
          ? 1 - p.life / p.death
          : p.life / p.death;
        this.ctx.fillStyle = this.ctx.strokeStyle = this.o.color;
        this.ctx.beginPath();

        if (this.o.type === 'circle') {
          this.ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        } else if (this.o.type === 'triangle') {
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p.x + p.size, p.y + p.size);
          this.ctx.lineTo(p.x + p.size, p.y - p.size);
        } else if (this.o.type === 'rectangle') {
          this.ctx.rect(p.x, p.y, p.size, p.size);
        }

        if (this.o.style === 'fill') {
          this.ctx.fill();
        } else if (this.o.style === 'stroke') {
          this.ctx.closePath();
          this.ctx.stroke();
        }

        this.ctx.globalAlpha = 1;
        this.ctx.rotate(-p.angle * Math.PI / 180);
        this.ctx.translate(-p.startX, -p.startY);
      }
    }
  }

  play() {
    this.frame = requestAnimationFrame(this.loop.bind(this));
  }

  pause() {
    cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  addParticle(options) {
    const frames = this.o.duration * 60 / 1000;
    const speed: number = (isFunction(this.o.speed)
      ? this.o.speed()
      : this.o.speed) as number;
    this.particles.push({
      startX: options.x,
      startY: options.y,
      x: this.disintegrating ? 0 : speed * -frames,
      y: 0,
      angle: rand(360),
      counter: this.disintegrating ? 0 : frames,
      increase: Math.PI * 2 / 100,
      life: 0,
      death: this.disintegrating ? frames - 20 + Math.random() * 40 : frames,
      speed: speed,
      size: isFunction(this.o.size) ? this.o.size() : this.o.size,
    });
  }

  addParticles(rect: any, progress) {
    const progressDiff = this.disintegrating
      ? progress - this.lastProgress
      : this.lastProgress - progress;
    this.lastProgress = progress;
    let x = this.options.canvasPadding;
    let y = this.options.canvasPadding;
    const progressValue =
      (this.isHorizontal() ? rect.width : rect.height) * progress +
      progressDiff * (this.disintegrating ? 100 : 220);
    if (this.isHorizontal()) {
      x +=
        this.o.direction === 'left'
          ? progressValue
          : rect.width - progressValue;
    } else {
      y +=
        this.o.direction === 'top'
          ? progressValue
          : rect.height - progressValue;
    }
    let i = Math.floor(
      this.o.particlesAmountCoefficient * (progressDiff * 100 + 1),
    );
    if (i > 0) {
      while (i--) {
        this.addParticle({
          x: x + (this.isHorizontal() ? 0 : rect.width * Math.random()),
          y: y + (this.isHorizontal() ? rect.height * Math.random() : 0),
        });
      }
    }
    if (!this.isAnimating()) {
      this.renderer.setStyle(this.canvas, 'display', 'block');
      this.play();
    }
  }

  addTransforms(value) {
    const translateProperty = this.isHorizontal() ? 'translateX' : 'translateY';
    const translateValue =
      this.o.direction === 'left' || this.o.direction === 'top'
        ? value
        : -value;
    this.renderer.setStyle(this.wrapper, transformString, `${translateProperty}(${translateValue}%)`);
    this.renderer.setStyle(this.el, transformString, `${translateProperty}(${-translateValue}%)`);
  }

  disintegrate(options: IOption = {}) {
    if (!this.isAnimating()) {
      this.disintegrating = true;
      this.lastProgress = 0;
      this.setup(options);
      const _ = this;
      this.animate(anim => {
        const value = anim.animatables[0].target.value;
        _.addTransforms(value);
        if (_.o.duration) {
          _.addParticles(_.rect, value / 100);
        }
      });
    }
  }

  integrate(options: IOption = {}) {
    if (!this.isAnimating()) {
      this.disintegrating = false;
      this.lastProgress = 1;
      this.setup(options);
      const _ = this;
      this.animate(anim => {
        const value = anim.animatables[0].target.value;
        setTimeout(() => {
          _.addTransforms(value);
        }, _.o.duration);
        if (_.o.duration) {
          _.addParticles(_.rect, value / 100);
        }
      });
    }
  }

  setup(options) {
    this.o = {...this.options, ...options};
    this.renderer.setStyle(this.wrapper, 'visibility', 'visible');
    if (this.o.duration) {
      this.rect = this.el.getBoundingClientRect();
      this.width = this.canvas.width =
        this.o.width || this.rect.width + this.o.canvasPadding * 2;
      this.height = this.canvas.height =
        this.o.height || this.rect.height + this.o.canvasPadding * 2;
    }
  }

  public isDisintegrated() {
    return this.disintegrating;
  }

  animate(update) {
    const _ = this;
    anime({
      targets: {value: _.disintegrating ? 0 : 100},
      value: _.disintegrating ? 100 : 0,
      duration: _.o.duration,
      easing: _.o.easing,
      begin: _.o.begin,
      update: update,
      complete: () => {
        if (_.disintegrating) {
          this.renderer.setStyle(_.wrapper, 'visibility', 'hidden');
        }
      },
    });
  }

  isAnimating() {
    return !!this.frame;
  }

  isHorizontal() {
    return this.o.direction === 'left' || this.o.direction === 'right';
  }
}



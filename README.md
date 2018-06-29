# angular-particle-effect-button ([demo](https://codesandbox.io/s/j0jyz323v))

> Superb particle effect buttons for Angular 6.

[![Demo](https://raw.githubusercontent.com/danielpdev/angular-particle-effect-button/demo-animation.gif)](https://github.com/danielpdev/angular-particle-effect-button)

This is a Angular 6 directive used as port of an awesome [Codrops Article](https://tympanus.net/codrops/2018/04/25/particle-effects-for-buttons/) by [Luis Manuel](https://tympanus.net/codrops/author/luis/) (original [source](https://github.com/codrops/ParticleEffectsButtons/)).

## Install

```bash
npm i --save angular-particle-effect-button
```

## Usage

Check out the [Demo](https://codesandbox.io/s/j0jyz323v/) to see it in action.

```ts
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ParticleEffectButtonModule } from "angular-particle-effect-button";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ParticleEffectButtonModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

```html
<button libParticleEffectButton [pHidden]="hidden" (click)="hidden=!hidden">Hide me</button>
```

Note that `libParticleEffectButton` can be added to anything from a simple `<button>` to a complex Angular subtree. The element for which you'll add `libParticleEffectButton`
will be wrapped into a tree like that:
```html
<div style="position: relative; display: inline-block;">
  <div style="position: relative; display: inline-block; overflow: hidden;">
    <button libparticleeffectbutton="">Hide me</button>
  </div>
  <canvas style="position: absolute; pointer-events: none; top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0px); display: none;">
  </canvas>
</div>
```

Changing the `hidden` boolean property will trigger an animation, typically as a result of a click on the button's contents. 
If `hidden` changes to `true`, the button will perform a disintegrating animation. If `hidden` changes to `false`, it will reverse and reintegrate the original content.

## Props

| Property      | Type               | Default                               | Description                                                                                                                                  |
|:--------------|:-------------------|:--------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------|
| `pHidden`  | boolean           | false                                  | Whether button should be hidden or visible. Changing this property starts an animation. |
| `pColor`  | string           | '#000'                                  | Particle color. Should match the button content's background color |
| `pDuration`  | number           | 1000                                  | Animation duration in milliseconds. |
| `pEasing`  | string           | 'easeInOutCubic'                        | Animation easing. |
| `pType`  | string           | circle                                  | 'circle' or 'rectangle' or 'triangle' |
| `pStyle`  | string           | fill                                  | 'fill' or 'stroke' |
| `pDirection`  | string           | 'left'                                  | 'left' or 'right' or 'top' or 'bottom' |
| `pCanvasPadding`  | number           | 150                                  | Amount of extra padding to add to the canvas since the animation will overflow the content's bounds |
| `pSize`  | number | func           | random(4)                             | Particle size. May be a static number or a function which returns numbers. |
| `pSpeed`  | number | func           | random(2)                             | Particle speed. May be a static number or a function which returns numbers. |
| `pParticlesAmountCoefficient`  | number    | 3                             | Increases or decreases the relative number of particles |
| `pOoscillationCoefficient`  | number           | 30                         | Increases or decreases the relative curvature of particles |
| `pBegin`  | EventEmitter           | EventEmitter                                     | Callback to get notified when an animation starts. |
| `pComplete`  | EventEmitter           | EventEmitter                                  | Callback to get notified when an animation completes. |


I tried to keep the properties and behavior exactly the same as in the original codrops version.

## Related

- [anime.js](http://animejs.com/) - Underlying animation engine.
- [ParticleEffectsButtons](https://github.com/codrops/ParticleEffectsButtons/) - Original source this library is based on.
- [Codrops Article](https://tympanus.net/codrops/2018/04/25/particle-effects-for-buttons/) - Original article this library is based on.

This module was bootstrapped with [angular-cli](https://cli.angular.io).

## License

MIT © [danielpdev](https://github.com/danielpdev)
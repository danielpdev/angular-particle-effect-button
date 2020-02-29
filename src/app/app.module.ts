import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ParticleEffectButtonModule } from 'angular-particle-effect-button';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ParticleEffectButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}

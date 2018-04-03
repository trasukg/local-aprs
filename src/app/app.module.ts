import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import {CdkTableModule} from '@angular/cdk/table';
import {Location, LocationStrategy, HashLocationStrategy} from '@angular/common';
import {MaterialModule} from './material-module';


import {HostService} from './host.service';
import {AprsSituationService} from './aprs-situation.service';
import { LocalAprsPacketsComponent } from './local-aprs-packets/local-aprs-packets.component';
import { SsidFormPipe } from './ssid-form.pipe';
import { FormatReceptionsPipe } from './format-receptions.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LocalAprsPacketsComponent,
    SsidFormPipe,
    FormatReceptionsPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    AprsSituationService,
    HostService,
    [Location, {provide: LocationStrategy, useClass: HashLocationStrategy}]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(hostService: HostService) {
    console.log("Constructor for AppModule was called.");
  }
}

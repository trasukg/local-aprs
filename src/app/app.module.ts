/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import {CdkTableModule} from '@angular/cdk/table';
import {Location, LocationStrategy, HashLocationStrategy} from '@angular/common';
import {MaterialModule} from './material-module';


import {HostService} from './host.service';
import {AprsSituationService} from './aprs-situation.service';
import { LocalAprsPacketsComponent } from './local-aprs-packets/local-aprs-packets.component';
import { SsidFormPipe } from './ssid-form.pipe';
import { FormatReceptionsPipe } from './format-receptions.pipe';
import { RawPacketsComponent } from './raw-packets/raw-packets.component';
import { Tnc2formPipe } from './tnc2form.pipe';
import { StationsComponent } from './stations/stations.component';
import { StationDetailComponent } from './station-detail/station-detail.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AprsSituationEffects } from './aprs-situation/aprs-situation.effects';
import * as fromAprsSituation from './aprs-situation/aprs-situation.reducer';
import * as fromHostConfig from './host-config/host-config.reducer';
import { HostConfigEffects } from './host-config/host-config.effects';
import { AppEffects } from './app.effects';

const appRoutes: Routes = [
  { path: 'packets', component: LocalAprsPacketsComponent },
  { path: 'raw-packets', component: RawPacketsComponent },
  { path: 'stations', component: StationsComponent },
  { path: 'stations/:stationId', component: StationDetailComponent },
  { path: '',
    redirectTo: '/packets',
    pathMatch: 'full'
  },
  { path: '**',
    redirectTo: '/packets',
    pathMatch: 'full'
 }
];

@NgModule({
  declarations: [
    AppComponent,
    LocalAprsPacketsComponent,
    SsidFormPipe,
    FormatReceptionsPipe,
    RawPacketsComponent,
    Tnc2formPipe,
    StationsComponent,
    StationDetailComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    StoreModule.forRoot(
      {
        'aprsSituation': fromAprsSituation.reducer,
        'hostConfig': fromHostConfig.reducer
      },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true
        }
      }
    ),
    EffectsModule.forFeature([AprsSituationEffects, HostConfigEffects]),
    StoreModule.forFeature(fromAprsSituation.aprsSituationFeatureKey, fromAprsSituation.reducer),
    StoreModule.forFeature(fromHostConfig.hostConfigFeatureKey, fromHostConfig.reducer),
    EffectsModule.forRoot([AppEffects])
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

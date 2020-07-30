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

import { ChangeDetectorRef, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {MatSidenav} from '@angular/material/sidenav';
import {HostService} from './host.service';
import { Store } from '@ngrx/store';
import * as appActions from './app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  @ViewChild('snav') sidenav: MatSidenav;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    hostService: HostService,
    private store: Store<any>
  ) {
    this.mobileQuery = media.matchMedia('(max-width:600px)');
    this.mobileQueryListener = () => {
      // console.log("mobileQuery.matches=" + this.mobileQuery.matches);
      if (this.mobileQuery.matches === false) {
        this.sidenav.open();
      }
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    // console.log("Sending start action.");
    this.store.dispatch(appActions.startupApplication());
  }

  ngAfterViewInit() {
    if (this.mobileQuery.matches === false) {
      this.sidenav.open();
    }
  }

  closeSidenavIfMobile() {
    if (this.mobileQuery.matches === true) {
      this.sidenav.close();
    }
  }
}

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

import { Pipe, PipeTransform } from '@angular/core';
import { ax25utils } from 'utils-for-aprs';

@Pipe({
  name: 'formatReceptions'
})
export class FormatReceptionsPipe implements PipeTransform {

  transform(receptions: any, args?: any): any {
    var ret="";
    for (var i in receptions) {
      if(receptions.hasOwnProperty(i)) {
        var frame=receptions[i];
        if (frame.repeaterPath === undefined) {
          ret=ret + "(Direct)";
        } else {
          ret=ret + "(" + ax25utils.repeaterPathToString(frame.repeaterPath) +
          ((frame.forwardingSource!==undefined)?(
            " via " + ax25utils.addressToString(frame.forwardingSource) +
            '->' + ax25utils.addressToString(frame.forwardingDestination) +
            ' (' + ax25utils.repeaterPathToString(frame.forwardingRepeaterPath) + ')')
            : '') + ")";
        }
      }
    }
    return ret;
  }

}
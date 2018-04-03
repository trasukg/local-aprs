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

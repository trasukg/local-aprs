import { Pipe, PipeTransform } from '@angular/core';
import { ax25utils } from 'utils-for-aprs';

@Pipe({
  name: 'ssidForm'
})
export class SsidFormPipe implements PipeTransform {

  transform(address: any, args?: any): any {
    return ax25utils.addressToString(address);
  }

}

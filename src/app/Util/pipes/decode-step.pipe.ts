import { Pipe, PipeTransform } from '@angular/core';
import { decodeString } from './character-decode';

@Pipe({name: 'decodeSTEP', pure: true})
export class DecodeSTEPPipe implements PipeTransform {

  public language: string = "en";

  transform(value: string): string {
    return decodeString(value);
  }

}
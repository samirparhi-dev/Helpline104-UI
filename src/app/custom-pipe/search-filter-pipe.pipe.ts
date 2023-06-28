import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilterPipe'
})
export class SearchFilterPipePipe implements PipeTransform {

  public transform(value:any, keys: string, term: string) {
    

    if (!term) return value;
    return (value || []).filter((value) => keys.split(',').some(key => value.hasOwnProperty(key) && new RegExp(term, 'gi').test(value[key])));

  }
}

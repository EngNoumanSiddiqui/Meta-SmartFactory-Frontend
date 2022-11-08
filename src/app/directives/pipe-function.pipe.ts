import { Pipe, PipeTransform } from '@angular/core';

/*
	Purpose: To use a component function as a pipe instead of creating different custom pipes for each template function
	Example 1:
		FROM: <span>{{ getDotColor( status ) }}</span>

		TO: <span>{{ status | pipeFunction:getDotColor }}

		OR: <span>{{ status | pipeFunction:getDotColor:this }}		// To bind component `this` as context
*/
// Copied from: https://github.com/ArtemLanovyy/ngx-pipe-function
@Pipe({
  name: 'pipeFunction'
})
export class PipeFunction implements PipeTransform {

  public transform( value: any, handler: (value: any) => any, context?: any ): any {
    if ( context ) {
      return handler.call( context, value );
    }

    return handler( value );
  }

}

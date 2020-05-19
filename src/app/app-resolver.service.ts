import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class AppResolver implements Resolve<any> {
  constructor(private ngxService: NgxUiLoaderService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('resolve');
    setTimeout(() => {
      this.ngxService.start();
    }, 500);
    return null;
  }
}

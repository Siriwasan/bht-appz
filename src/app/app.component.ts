import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from './store/root-store.state';
import { AppStoreSelectors, AppStoreActions } from './store/app';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading$ = this.store.select(AppStoreSelectors.isLoading);
  theme$ = this.store.select(AppStoreSelectors.theme);
  private subscription: Subscription[] = [];

  constructor(private store: Store<AppState>, private breakpointObserver: BreakpointObserver, private ngxService: NgxUiLoaderService) {}

  ngOnInit() {
    this.subscription.push(
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape, Breakpoints.TabletPortrait])
        .subscribe((result) => {
          let device = 'Others';

          if (result.breakpoints[Breakpoints.HandsetPortrait]) {
            device = 'HandsetPortrait';
          } else if (result.breakpoints[Breakpoints.HandsetLandscape]) {
            device = 'HandsetLandscape';
          } else if (result.breakpoints[Breakpoints.TabletPortrait]) {
            device = 'TabletPortrait';
          }

          this.store.dispatch(AppStoreActions.setDevice({ newDevice: device }));
          this.store.dispatch(AppStoreActions.initializeLayout());
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  ngAfterViewInit() {
    this.isLoading$.subscribe((isLoading) => {
      if (isLoading) {
        this.ngxService.start();
      } else {
        this.ngxService.stop();
      }
    });
  }
}

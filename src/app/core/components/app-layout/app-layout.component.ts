import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/store/root-store.state';
import { AppStoreSelectors, AppStoreActions } from 'src/app/store/app';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  device = 'others';
  navbarMode = 'side';
  navbarOpened = true;
  private subscription: Subscription[] = [];

  fillerContent = Array.from(
    { length: 50 },
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
  );

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.subscription.push(
      this.store.select(AppStoreSelectors.device).subscribe((newDevice) => (this.device = newDevice)),
      this.store.select(AppStoreSelectors.navbarMode).subscribe((mode) => (this.navbarMode = mode)),
      this.store.select(AppStoreSelectors.navbarOpened).subscribe((open) => (this.navbarOpened = open))
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  closeNavbar() {
    this.store.dispatch(AppStoreActions.closeNavbar());
  }

  onTouch(event: any) {
    const thresholdX = 100;
    const thresholdMarginX = 50;

    const initialX = event.touches[0].clientX;
    const initialY = event.touches[0].clientY;

    const touchStart = () => {
      event.target.addEventListener('touchmove', touchMove);
      event.target.addEventListener('touchend', touchEnd);
    };

    const touchMove = (e) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;

      const diffX = initialX - currentX;
      const diffY = initialY - currentY;

      if (diffX > 0 && diffX > thresholdX) {
        // console.log('swiped left');
        if (this.navbarMode === 'over' && this.navbarOpened) {
          this.store.dispatch(AppStoreActions.closeNavbar());
          touchEnd();
        }
      } else if (diffX < 0 && diffX < -thresholdX) {
        // console.log('swiped right');
        if (this.navbarMode === 'over') {
          this.store.dispatch(AppStoreActions.openNavbar());
          touchEnd();
        }
      }
    };

    const touchEnd = () => {
      event.target.removeEventListener('touchmove', touchMove);
      event.target.removeEventListener('touchend', touchEnd);
    };

    if (
      (this.navbarMode === 'over' && !this.navbarOpened && initialX <= thresholdMarginX) ||
      (this.navbarMode === 'over' && this.navbarOpened)
    ) {
      // console.log('Register touch');
      touchStart();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { CounterStoreActions, CounterStoreSelectors } from '../../store/counter';
import { AppStoreActions, AppStoreSelectors } from '../../store/app';
import { AppState } from 'src/app/store/root-store.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  count$ = this.store.select(CounterStoreSelectors.count);
  appTheme$ = this.store.select(AppStoreSelectors.theme);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(AppStoreActions.setSidebarMode({ mode: null }));
  }

  increment() {
    this.store.dispatch(CounterStoreActions.increment());
  }

  decrement() {
    this.store.dispatch(CounterStoreActions.decrement());
  }

  reset() {
    this.store.dispatch(CounterStoreActions.reset());
  }

  toggleTheme() {
    this.store.dispatch(AppStoreActions.toggleTheme());
  }
}

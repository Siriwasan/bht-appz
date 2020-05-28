import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/root-store.state';
import { AppStoreActions, AppStoreSelectors } from 'src/app/store/app';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  device$ = this.store.select(AppStoreSelectors.device);
  @Output() navbarToggle = new EventEmitter<void>();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  toggleNavbar() {
    this.store.dispatch(AppStoreActions.toggleNavbar());
  }
}

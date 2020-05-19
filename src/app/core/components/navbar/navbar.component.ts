import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/store/root-store.state';
import { AppStoreActions, AppStoreSelectors } from 'src/app/store/app';
import { Router } from '@angular/router';
import { MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() navItemSelected = new EventEmitter<void>();
  theme$ = this.store.select(AppStoreSelectors.theme);

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {}

  onNavItemSelected(url?: string) {
    this.navItemSelected.emit();

    if (url && url !== this.router.url) {
      this.store.dispatch(AppStoreActions.startLoading());
      setTimeout(() => {
        this.router.navigateByUrl(url);
      }, 50);
    }
    document.getElementById('acsd290').classList.toggle('active', url === '/registry/acsd/acsd290');
  }

  toggleDarkTheme(checked: boolean) {
    this.store.dispatch(AppStoreActions.setDarkTheme({ darkTheme: checked }));
  }
}

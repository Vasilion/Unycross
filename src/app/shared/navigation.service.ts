import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  scrollToTop(route: string) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    this.router.navigate([route]);
  }
}

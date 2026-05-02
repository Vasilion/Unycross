import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CyberpunkBackgroundService } from './shared/cyberpunk-background.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bgContainer') bgContainer!: ElementRef;
  title = 'unycross-llc';

  private routerSub?: Subscription;
  private mobileMql = window.matchMedia('(max-width: 760px)');
  private mobileListener = () => this.applyBackgroundForCurrentRoute();

  constructor(
    private cyberpunkService: CyberpunkBackgroundService,
    private router: Router,
  ) {}

  ngAfterViewInit() {
    this.cyberpunkService.attach(this.bgContainer.nativeElement);
    this.applyBackgroundForCurrentRoute();

    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.applyBackgroundForCurrentRoute());

    // Re-evaluate when the viewport crosses the mobile breakpoint (rotation,
    // window resize, devtools toggle). addEventListener form is supported on
    // every evergreen browser; addListener is the older polyfill path.
    if (typeof this.mobileMql.addEventListener === 'function') {
      this.mobileMql.addEventListener('change', this.mobileListener);
    } else {
      this.mobileMql.addListener(this.mobileListener);
    }
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
    if (typeof this.mobileMql.removeEventListener === 'function') {
      this.mobileMql.removeEventListener('change', this.mobileListener);
    } else {
      this.mobileMql.removeListener(this.mobileListener);
    }
    this.cyberpunkService.stop();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * The cyberpunk three.js scene runs only on desktop, on routes where it
   * doesn't compete with reading content. The blog routes get a calmer
   * background so long-form posts don't flicker behind 2000 particles, and
   * mobile gets the static scanline overlay alone (saving battery + frame
   * budget).
   */
  private applyBackgroundForCurrentRoute(): void {
    const url = this.router.url;
    const onBlog = url === '/blog' || url.startsWith('/blog/');
    const onMobile = this.mobileMql.matches;
    const shouldRun = !onBlog && !onMobile;

    if (shouldRun && !this.cyberpunkService.isActive()) {
      this.cyberpunkService.start();
    } else if (!shouldRun && this.cyberpunkService.isActive()) {
      this.cyberpunkService.stop();
    }
  }
}

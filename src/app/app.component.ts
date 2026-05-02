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
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
    this.cyberpunkService.stop();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * The cyberpunk three.js scene runs everywhere except the blog routes —
   * 2000 particles fighting for attention behind a 700-word post is the
   * one place the visual costs more than it gives.
   */
  private applyBackgroundForCurrentRoute(): void {
    const url = this.router.url;
    const onBlog = url === '/blog' || url.startsWith('/blog/');
    const shouldRun = !onBlog;

    if (shouldRun && !this.cyberpunkService.isActive()) {
      this.cyberpunkService.start();
    } else if (!shouldRun && this.cyberpunkService.isActive()) {
      this.cyberpunkService.stop();
    }
  }
}

import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
export class AppComponent implements AfterViewInit {
  @ViewChild('bgContainer') bgContainer!: ElementRef;
  title = 'unycross-llc';

  constructor(private cyberpunkService: CyberpunkBackgroundService) {}

  ngAfterViewInit() {
    this.cyberpunkService.initBackground(this.bgContainer.nativeElement);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

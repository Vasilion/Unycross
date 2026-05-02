import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { RouterLink } from '@angular/router';
import { NavigationService } from '../../shared/navigation.service';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate(
          '0.5s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('fadeInUp', [
      state('void', style({ opacity: 0, transform: 'translateY(50px)' })),
      transition(':enter', [
        animate(
          '0.8s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class AboutComponent implements OnInit {
  state = 'visible';
  constructor(
    private navigationService: NavigationService,
    private seo: SeoService,
  ) {}

  ngOnInit() {
    this.state = 'visible';
    this.seo.setMeta({
      title: 'About',
      description:
        "Luke Vasilion's story — software engineer with nearly a decade of experience building products that matter. Currently powering flight dynamics for the ISS, JWST, and Lunar Gateway at a.i. solutions.",
      path: '/about',
    });
  }

  navAndScroll() {
    this.navigationService.scrollToTop('/contact');
  }
}

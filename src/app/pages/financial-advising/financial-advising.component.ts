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

@Component({
  selector: 'app-financial-advising',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './financial-advising.component.html',
  styleUrls: ['./financial-advising.component.scss'],
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
export class FinancialAdvisingComponent implements OnInit {
  state = 'visible';
  services = [
    {
      title: 'Investment Planning',
      description:
        "Strategic investment solutions tailored to your financial goals and risk tolerance. We'll help you build a diversified portfolio aligned with your objectives.",
    },
    {
      title: 'Retirement Planning',
      description:
        "Comprehensive retirement strategies to ensure your financial security in your golden years. We'll create a roadmap to help you achieve the retirement lifestyle you envision.",
    },
    {
      title: 'Debt Management',
      description:
        "Personalized debt paydown strategies to help you eliminate debt efficiently while maintaining financial stability. We'll create a plan that fits your unique situation.",
    },
  ];

  constructor(private navigationService: NavigationService) {}

  ngOnInit() {
    this.state = 'visible';
  }

  navAndScroll() {
    this.navigationService.scrollToTop('/contact');
  }
}

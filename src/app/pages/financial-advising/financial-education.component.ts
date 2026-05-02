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
  selector: 'app-financial-education',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './financial-education.component.html',
  styleUrls: ['./financial-education.component.scss'],
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
export class FinancialEducationComponent implements OnInit {
  state = 'visible';
  services = [
    {
      title: 'Investment Education',
      description:
        "Learn how to build and manage a diversified investment portfolio. I'll teach you the fundamentals of investing and help you understand how to align your investments with your goals.",
    },
    {
      title: 'Retirement Planning Education',
      description:
        'Master the art of retirement planning through comprehensive educational resources. Learn how to create and maintain a sustainable retirement strategy that works for your lifestyle.',
    },
    {
      title: 'Financial Literacy',
      description:
        "Develop essential financial skills through personalized programs. From budgeting to debt management, I'll help you build a strong foundation for financial success.",
    },
  ];

  constructor(
    private navigationService: NavigationService,
    private seo: SeoService,
  ) {}

  ngOnInit() {
    this.state = 'visible';
    this.seo.setMeta({
      title: 'Financial Education',
      description:
        'Investment education, retirement planning, and financial literacy programs from Luke Vasilion. Personalized guidance to help you build a stronger foundation for financial success.',
      path: '/financial-education',
    });
  }

  navAndScroll() {
    this.navigationService.scrollToTop('/contact');
  }

  goToStandard() {
    window.open('https://mee6.xyz/en/m/1384673721599397948', '_blank');
  }

  goToPro() {
    window.open('https://mee6.xyz/en/m/1384673721599397948', '_blank');
  }
}

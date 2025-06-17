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
        "Learn how to build and manage a diversified investment portfolio. We'll teach you the fundamentals of investing and help you understand how to align your investments with your goals.",
    },
    {
      title: 'Retirement Planning Education',
      description:
        'Master the art of retirement planning through our comprehensive educational resources. Learn how to create and maintain a sustainable retirement strategy that works for your lifestyle.',
    },
    {
      title: 'Financial Literacy',
      description:
        "Develop essential financial skills through our educational programs. From budgeting to debt management, we'll help you build a strong foundation for financial success.",
    },
  ];

  constructor(private navigationService: NavigationService) {}

  ngOnInit() {
    this.state = 'visible';
  }

  navAndScroll() {
    this.navigationService.scrollToTop('/contact');
  }

  goToStandard() {
    window.open('https://buy.stripe.com/00weVedj2e610a3fPa4Ja00', '_blank');
  }

  goToPro() {
    window.open('https://buy.stripe.com/cNi6oIen6ge9e0T9qM4Ja01', '_blank');
  }
}

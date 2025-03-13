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
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
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
export class ServicesComponent implements OnInit {
  state = 'visible';
  constructor(private navigationService: NavigationService) {}
  services = [
    {
      title: 'Web Hosting',
      description:
        'With 13 years of hands-on experience, I provide high performance hosting optimized for speed and reliability. Tailored to your niche, my solutions ditch the generic setups of DIY platforms for a custom built foundation that scales with you.',
    },
    {
      title: 'Web Development',
      description:
        'I build more than websites I create digital solutions. Drawing on over a decade of coding expertise, I deliver responsive, custom designs that match your team’s vision, leaving one size fits all templates in the dust.',
    },
    {
      title: 'Maintenance & Support',
      description:
        'Your site deserves relentless care. I offer proactive updates and 24/7 support to keep it running at peak performance—no shortcuts, just dependable service you can count on.',
    },
  ];
  aiFeatures = [
    {
      title: 'AI-Powered Analytics',
      description:
        'Leveraging AI, I turn raw data into sharp, actionable strategies. My analytics boost your site’s performance and engagement, giving you an edge over standard tools.',
    },
    {
      title: 'Personalized Content',
      description:
        'With AI and a decade plus of web expertise, I craft content that adapts to each visitor. It’s dynamic, precise, and built to connect because generic pages don’t cut it for your audience.',
    },
    {
      title: 'Automation Tools',
      description:
        'I use AI to streamline your operations, from smart chatbots to seamless scheduling. My tools cut the busywork and elevate your site’s user experience.',
    },
  ];

  ngOnInit() {
    this.state = 'visible';
  }

  navAndScroll() {
    this.navigationService.scrollToTop('/contact');
  }
}

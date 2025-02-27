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

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
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
  services = [
    {
      title: 'Web Hosting',
      description:
        'Reliable, high-performance hosting solutions optimized for speed and scalability, perfect for motocross events and niche websites.',
    },
    {
      title: 'Web Development',
      description:
        'Custom, motocross-inspired websites with responsive designs, tailored for riders, teams, and businesses across any industry.',
    },
    {
      title: 'Maintenance & Support',
      description:
        'Ongoing support and updates to keep your site running smoothly, with 24/7 assistance for peak performance.',
    },
  ];
  aiFeatures = [
    {
      title: 'AI-Powered Analytics',
      description:
        'Gain insights with AI-driven analytics to optimize your site’s performance and user engagement.',
    },
    {
      title: 'Personalized Content',
      description:
        'Implement AI to deliver dynamic, personalized content for your motocross fans or customers.',
    },
    {
      title: 'Automation Tools',
      description:
        'Streamline operations with AI automation for scheduling, chatbots, and more, enhancing user experience.',
    },
  ];

  ngOnInit() {
    this.state = 'visible'; // Trigger animations on load
  }
}

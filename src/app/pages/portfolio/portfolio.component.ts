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
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  animations: [
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
export class PortfolioComponent implements OnInit {
  state = 'visible';
  projects = [
    {
      title: 'Martin MX Park',
      description:
        'A dynamic website for a motocross park, highlighting events and rider experiences.',
      url: 'https://martinmxpark.com',
      image: 'assets/martin.PNG',
    },
    {
      title: 'Mecosta MX',
      description:
        'A motocross-focused website featuring tracks, events, and community engagement.',
      url: 'https://mecostamx.com',
      image: 'assets/mecosta.PNG',
    },
    {
      title: 'United Steps',
      description:
        'A resource for suicide prevention and support, focusing on education and community outreach.',
      url: 'https://united-steps.org',
      image: 'assets/us.png',
    },
    {
      title: 'Rollin Brummette',
      description:
        'A personal portfolio showcasing creative projects and professional work.',
      url: 'https://rollinbrummette.com',
      image: 'assets/rollin.PNG',
    },
    {
      title: 'Kollar Piano Services',
      description:
        'A professional site for piano tuning and repair services, with a clean, user-friendly design.',
      url: 'https://kollarpianoservices.com',
      image: 'assets/kpt.PNG',
    },
  ];

  ngOnInit() {
    this.state = 'visible'; // Trigger animations on load
  }

  openProject(url: string) {
    window.open(url, '_blank');
  }
}

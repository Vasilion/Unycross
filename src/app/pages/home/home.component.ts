import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit {
  state = 'visible';
  services = [
    {
      title: 'Motocross Websites',
      description:
        'High-octane designs tailored for riders, teams, and events.',
    },
    {
      title: 'Custom Development',
      description:
        'Bespoke solutions for any niche—speed and precision guaranteed.',
    },
    {
      title: 'Responsive Design',
      description:
        'Seamless experiences across all devices, from track to screen.',
    },
  ];
  testimonials = [
    {
      quote:
        'Their motocross site transformed our online presence—fast, sleek, and unbeatable!',
      author: 'Mike R., Motocross Team Lead',
    },
    {
      quote:
        'Incredible work on our custom web project. Highly recommend for any niche!',
      author: 'Sarah L., E-commerce Owner',
    },
  ];

  ngOnInit() {
    this.state = 'visible'; // Trigger animations on load
  }
}

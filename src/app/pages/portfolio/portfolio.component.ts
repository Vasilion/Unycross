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
        'One of the most iconic and popular motocross tracks in the world.',
      url: 'https://martinmxpark.com',
      image: 'assets/martin.webp',
    },
    {
      title: 'PIP-DEX 3000',
      description: 'A Fallout 3 pipboy inspired pokedex.',
      url: 'https://main.d2gixauk72uxbl.amplifyapp.com',
      image: 'assets/pipdex.webp',
    },
    {
      title: 'United Steps',
      description:
        'A resource for suicide prevention and support. Based out of Michigan',
      url: 'https://united-steps.org',
      image: 'assets/us.webp',
    },
    {
      title: 'Rollin Brummette',
      description:
        'A musician fan membership platform for a rising country music artist.',
      url: 'https://rollinbrummette.com',
      image: 'assets/rollin.webp',
    },
    {
      title: 'Kollar Piano Services',
      description:
        'A professional site for piano tuning and repair services, in Lansing, MI.',
      url: 'https://kollarpianoservices.com',
      image: 'assets/kpt.webp',
    },
    {
      title: 'Mecosta MX',
      description:
        'A motocross track that looks like something out of a video game. Located in Mecosta, MI',
      url: 'https://mecostamx.com',
      image: 'assets/mecosta.webp',
    },
  ];

  ngOnInit() {
    this.state = 'visible';
  }
}

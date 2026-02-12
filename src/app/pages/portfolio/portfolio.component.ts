import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterLink],
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
  caseStudies = [
    {
      title: 'Martin MX Park',
      summary: 'One of the most iconic and popular motocross tracks in the world.',
      challenge:
        'Modernize the site experience while supporting real-world event needs like registrations and calendars.',
      solution:
        'A custom site build with tailored UX, streamlined navigation, and interactive features designed around the track’s operations.',
      result:
        'A faster, clearer customer journey that supports sign-ups and keeps visitors engaged across devices.',
      url: 'https://martinmxpark.com',
      image: 'assets/martin.webp',
    },
    {
      title: 'PIP-DEX 3000',
      summary: 'A Fallout 3 pipboy inspired pokedex.',
      challenge:
        'Deliver a unique, themed UI without sacrificing usability and performance.',
      solution:
        'A fully custom front-end build with a distinctive design system and optimized rendering.',
      result:
        'A memorable interactive experience that loads fast and feels native to the theme.',
      url: 'https://main.d2gixauk72uxbl.amplifyapp.com',
      image: 'assets/pipdex.webp',
    },
    {
      title: 'United Steps',
      summary:
        'A resource for suicide prevention and support. Based out of Michigan',
      challenge:
        'Create a trustworthy, accessible resource hub where people can quickly find help.',
      solution:
        'A custom information architecture with clear navigation and accessibility-first layout choices.',
      result:
        'A calmer, clearer experience that helps users find support resources quickly.',
      url: 'https://united-steps.org',
      image: 'assets/us.webp',
    },
    {
      title: 'Rollin Brummette',
      summary:
        'A musician fan membership platform for a rising country music artist.',
      challenge:
        'Build a fan experience that supports memberships and repeat engagement.',
      solution:
        'A custom platform with a content flow designed around fans, releases, and ongoing value.',
      result:
        'A stronger brand hub that supports community growth and retention.',
      url: 'https://rollinbrummette.com',
      image: 'assets/rollin.webp',
    },
    {
      title: 'Kollar Piano Services',
      summary:
        'A professional site for piano tuning and repair services, in Lansing, MI.',
      challenge:
        'Stand out locally with a professional look and clear service messaging.',
      solution:
        'A custom small business site focused on credibility, clarity, and conversion.',
      result:
        'A polished web presence that communicates value and encourages direct inquiries.',
      url: 'https://kollarpianoservices.com',
      image: 'assets/kpt.webp',
    },
    {
      title: 'Mecosta MX',
      summary:
        'A motocross track that looks like something out of a video game. Located in Mecosta, MI',
      challenge:
        'Present a high-energy brand experience while keeping core info easy to find.',
      solution:
        'A custom build with bold visuals, clear site structure, and performance-conscious assets.',
      result:
        'A site that matches the brand’s energy while staying fast and easy to navigate.',
      url: 'https://mecostamx.com',
      image: 'assets/mecosta.webp',
    },
  ];

  constructor(private seo: SeoService) {}

  ngOnInit() {
    this.state = 'visible';

    this.seo.update({
      title: 'Custom Web Development Portfolio | Unycross',
      description:
        'See examples of custom websites and digital experiences built and hosted by Unycross for businesses and organizations across Michigan.',
    });
  }
}

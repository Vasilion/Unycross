import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { NavigationService } from '../../shared/navigation.service';
import { SeoService } from '../../shared/seo.service';

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

  constructor(
    private navigationService: NavigationService,
    private seo: SeoService,
  ) {}

  career = [
    {
      company: 'a.i. solutions',
      role: 'Senior Space Products Frontend Engineer',
      period: 'Current',
      description:
        'Building the frontend for FreeFlyer, an astrodynamics software suite powering missions for the International Space Station, James Webb Space Telescope, Lunar Gateway, and Dream Chaser.',
      tech: ['Angular', 'TypeScript', 'Astrodynamics'],
    },
    {
      company: 'State of Michigan, Senate',
      role: 'Full Stack Developer',
      period: '2022 - 2025',
      description:
        'Architected and built Eva from Sprint 0, a legislation processing platform streamlining bills, amendments, and resolutions. Lead front-end developer on a team of 10.',
      tech: ['Angular', '.NET Core', 'SQL Server', 'Azure'],
    },
    {
      company: 'Salamander',
      role: 'Software Developer',
      period: '2020 - 2022',
      description:
        'Led front-end development for Salamander LIVE, used by 1.2M+ daily users including first responders. Delivered v66 update with 138 new features and zero post-release bugs.',
      tech: ['Angular', 'TypeScript', 'UI/UX'],
    },
    {
      company: 'Allstate',
      role: 'Software Developer',
      period: '2019 - 2020',
      description:
        'Developed a secure agent portal using React, replacing Allstate\'s legacy system to meet modern compliance requirements.',
      tech: ['React', 'JavaScript', 'Enterprise'],
    },
    {
      company: 'Axcelino',
      role: 'Consultant',
      period: '2018 - 2019',
      description:
        'Delivered custom software solutions to clients across the United States. Built Angular front-end UI for Global Bankers and modernized legacy code.',
      tech: ['Angular', '.NET Core', 'Git'],
    },
    {
      company: 'General Motors',
      role: 'Software Developer',
      period: '2017 - 2018',
      description:
        'Worked on the Next Gen Vehicle Configurator, Marketing Admin CMS, and GM Brazil\'s Shop Click Drive platform.',
      tech: ['Angular', 'JavaScript', 'CMS'],
    },
  ];

  skills = [
    'Angular',
    '.NET Core',
    'TypeScript',
    'React',
    'SQL Server',
    'PostgreSQL',
    'Azure',
    'AWS',
    'NgRx',
    'Node.js',
    'Strapi',
    'CI/CD',
    'Git',
    'REST APIs',
    'WebSockets',
    'Ionic',
  ];

  ventures = [
    {
      title: 'UnyX Web Solutions',
      description:
        'My web development, hosting, and digital solutions business serving 25+ clients with scalable architecture.',
      link: 'https://unyxwebsolutions.com',
      external: true,
      icon: 'language',
    },
    {
      title: 'Financial Education',
      description:
        'Empowering others with financial literacy, investment strategies, and stock picks services.',
      link: '/financial-education',
      external: false,
      icon: 'trending_up',
    },
    {
      title: 'Unycross MX',
      description:
        'A passion project platform for motocross riders featuring race tracking, social features, and an interactive track map.',
      link: null,
      external: false,
      icon: 'sports_motorsports',
    },
  ];

  ngOnInit() {
    this.state = 'visible';
    this.seo.setMeta({
      title: 'Software Engineer & Entrepreneur',
      description:
        'Personal site of Luke Vasilion — Senior Space Products Frontend Engineer at a.i. solutions. Building products that power space missions, businesses, and financial futures.',
      path: '/',
    });
  }

  navAndScroll(route: string) {
    this.navigationService.scrollToTop(route);
  }
}

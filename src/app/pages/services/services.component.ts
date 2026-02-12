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
import { NavigationService } from '../../shared/navigation.service';
import { SeoService } from '../../shared/seo.service';

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
  constructor(
    private navigationService: NavigationService,
    private seo: SeoService
  ) {}
  customDevelopmentTiers = [
    {
      name: 'Basic',
      price: 'Starting at $2,500',
      tagline: 'A fast, professional launch for lean teams.',
      features: [
        'Custom design + build',
        'Mobile-first, conversion-focused layout',
        'On-page SEO fundamentals',
        'Performance baseline optimization',
        'Handoff or optional ongoing care',
      ],
    },
    {
      name: 'Growth',
      price: 'Starting at $7,500',
      tagline: 'For businesses that need more leads and integrations.',
      features: [
        'Everything in Basic',
        'Content architecture and UX refinement',
        'Advanced forms, tracking, and lead flow',
        'Integrations (CRM, email, scheduling)',
        'Launch support + iteration plan',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom Quote',
      tagline: 'Complex builds, high traffic, and strict requirements.',
      features: [
        'Everything in Growth',
        'Custom app features and workflows',
        'Security and performance hardening',
        'Accessibility-first approach',
        'Ongoing roadmap and priority delivery',
      ],
    },
  ];

  managedHostingTiers = [
    {
      name: 'Basic',
      price: '$149/mo',
      tagline: 'Peace of mind for small business sites.',
      features: [
        'Managed hosting + monitoring',
        'SSL, backups, and uptime checks',
        'Core updates (monthly)',
        'Basic security hardening',
        'Email support',
      ],
    },
    {
      name: 'Growth',
      price: '$349/mo',
      tagline: 'Priority support and proactive performance.',
      features: [
        'Everything in Basic',
        'Performance tuning and audits',
        'Staging environment for updates',
        'Enhanced security + vulnerability checks',
        'Priority support',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      tagline: 'For critical sites that can’t go down.',
      features: [
        'Everything in Growth',
        'Advanced monitoring and alerting',
        'Custom SLAs and maintenance windows',
        'Incident response support',
        'Ongoing optimization roadmap',
      ],
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

    this.seo.update({
      title:
        'Custom Websites, Managed Hosting & Maintenance | Unycross Grand Rapids',
      description:
        'Senior-level custom web development, managed hosting, and ongoing maintenance for businesses in Grand Rapids, Cedar Springs, and West Michigan.',
    });
  }

  navAndScroll() {
    this.navigationService.scrollToTop('/contact');
  }
}

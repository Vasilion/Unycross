import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Import DomSanitizer
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-ai-concepts',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './ai-concepts.component.html',
  styleUrls: ['./ai-concepts.component.scss'],
  animations: [
    trigger('fadeInZoom', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
      transition(':enter', [
        animate('0.8s ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
    trigger('slideInLeft', [
      state('void', style({ opacity: 0, transform: 'translateX(-100px)' })),
      transition(':enter', [
        animate(
          '0.6s ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
  ],
})
export class AiConceptsComponent implements OnInit {
  state = 'visible';
  aiTools = [
    {
      title: 'AI-Powered Analytics',
      description:
        'Gain deep insights into user behavior with real-time AI analytics, optimizing your motocross site’s performance.',
      icon: 'bar_chart',
    },
    {
      title: 'Personalized Content',
      description:
        'Deliver dynamic, AI-driven content tailored to your audience, enhancing engagement for riders and fans.',
      icon: 'person',
    },
    {
      title: 'Automation Tools',
      description:
        'Streamline operations with AI chatbots, scheduling, and workflows for seamless user experiences.',
      icon: 'settings',
    },
    {
      title: 'Predictive Maintenance',
      description:
        'Use AI to anticipate and resolve website issues before they impact your motocross events or business.',
      icon: 'build',
    },
    {
      title: 'Meshy AI Integration',
      description:
        'Explore Meshy.ai’s advanced AI tools for 3D modeling and design, perfect for innovative motocross visualizations.',
      iframeUrl: 'https://www.youtube.com/embed/EMaUjDV9EBk', // Add iframe URL for Meshy
      icon: '3d_rotation', // Using a Material icon relevant to 3D/innovation
    },
  ];
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.state = 'visible'; // Trigger animations on load
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url); // Sanitize the URL for iframe
  }

  showDetails(tool: any) {
    window.open(tool.iframeUrl, '_blank');
  }
}

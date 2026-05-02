import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { POSTS } from '../posts';
import { Post } from '../post.model';
import { SeoService } from '../../../shared/seo.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
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
      state('void', style({ opacity: 0, transform: 'translateY(40px)' })),
      transition(':enter', [
        animate(
          '0.7s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class BlogListComponent implements OnInit {
  state = 'visible';
  posts: Post[] = POSTS;

  constructor(private seo: SeoService) {}

  ngOnInit() {
    this.state = 'visible';
    this.seo.setMeta({
      title: 'Dev Blog · Building Nova',
      description:
        "Logbook for the Jarvis-inspired desktop AI assistant Luke Vasilion is building — voice, brain-swap, skills, a stock screener, and the war stories along the way.",
      path: '/blog',
    });
  }

  formatDate(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  }
}

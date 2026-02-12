import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Router } from '@angular/router';
import { SeoService } from '../../shared/seo.service';
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, MatCard],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  blogPosts = [
    {
      id: 1,
      title: 'Why Every Small Business Needs a Website in 2025',
      description:
        'Discover the essential reasons why a website is crucial for small businesses in today’s digital world.',
      image: 'assets/blog/needsite.jpg',
    },
    {
      id: 2,
      title: 'How a Website Can Increase Leads for Your Small Business',
      description:
        'A website works for your business even when you’re not. Unlike traditional marketing, which relies on business hours, a website allows potential customers to contact you, sign up for services, or request quotes anytime.',
      image: 'assets/blog/leads.jpg',
    },
  ];

  constructor(private router: Router, private seo: SeoService) {
    this.seo.update({
      title: 'Insights on Custom Web Development & Hosting | Unycross Blog',
      description:
        'Articles on custom web development, managed hosting, and digital strategy for small businesses in Grand Rapids, Cedar Springs, and West Michigan.',
    });
  }

  navigateToPost(postId: number) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    this.router.navigate(['/blog', postId]);
  }
}

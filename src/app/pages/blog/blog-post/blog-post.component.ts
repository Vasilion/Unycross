import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { POSTS, findPost } from '../posts';
import { Post } from '../post.model';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
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
  ],
})
export class BlogPostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  state = 'visible';
  post: Post | null = null;
  body: SafeHtml = '';
  prev: Post | null = null;
  next: Post | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      const found = slug ? findPost(slug) : undefined;
      if (!found) {
        this.router.navigate(['/blog']);
        return;
      }
      this.post = found;
      this.body = this.sanitizer.bypassSecurityTrustHtml(found.body);
      this.computeAdjacent(found);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    });
  }

  private computeAdjacent(current: Post) {
    const idx = POSTS.findIndex((p) => p.slug === current.slug);
    this.prev = idx >= 0 && idx < POSTS.length - 1 ? POSTS[idx + 1] : null;
    this.next = idx > 0 ? POSTS[idx - 1] : null;
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

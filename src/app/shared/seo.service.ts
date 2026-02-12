import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface SeoConfig {
  title: string;
  description: string;
  robots?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);

  update(config: SeoConfig) {
    this.title.setTitle(config.title);

    this.meta.updateTag({
      name: 'description',
      content: config.description,
    });

    if (config.robots) {
      this.meta.updateTag({
        name: 'robots',
        content: config.robots,
      });
    }

    const url = `https://www.unycross.com${this.router.url}`;

    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({
      property: 'og:image',
      content: 'https://www.unycross.com/assets/logo.jpg',
    });

    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({
      name: 'twitter:image',
      content: 'https://www.unycross.com/assets/logo.jpg',
    });
  }
}


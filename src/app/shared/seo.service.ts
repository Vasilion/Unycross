import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE_ORIGIN = 'https://www.unycross.com';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/assets/og-card.png`;
const SITE_NAME = 'Luke Vasilion';

export interface SeoOptions {
  /** Page-specific title fragment. Rendered as `<title>: <SITE_NAME>`. */
  title: string;
  /** Meta description + og:description + twitter:description. */
  description: string;
  /** Path the page is served from (with leading slash). Used for canonical + og:url. */
  path: string;
  /** Override og:image. Defaults to the site-wide social card. */
  image?: string;
  /** Override og:image:alt. */
  imageAlt?: string;
  /** og:type. Defaults to 'website'; blog posts pass 'article'. */
  type?: 'website' | 'article';
  /** ISO date for article:published_time (blog posts only). */
  publishedTime?: string;
  /** Tag list for article:tag (blog posts only). */
  tags?: string[];
}

/**
 * Sets per-route document head metadata: title, description, canonical link,
 * Open Graph tags, and Twitter card tags. Call from each routed component's
 * ngOnInit. Tags are reused (not duplicated) on subsequent navigations.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private titleService: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  setMeta(opts: SeoOptions): void {
    const fullTitle = `${opts.title} | ${SITE_NAME}`;
    const url = this.absoluteUrl(opts.path);
    const image = opts.image ?? DEFAULT_OG_IMAGE;
    const imageAlt = opts.imageAlt ?? `${SITE_NAME} — Unycross`;
    const ogType = opts.type ?? 'website';

    this.titleService.setTitle(fullTitle);

    this.upsertName('description', opts.description);

    this.upsertProperty('og:title', fullTitle);
    this.upsertProperty('og:description', opts.description);
    this.upsertProperty('og:url', url);
    this.upsertProperty('og:type', ogType);
    this.upsertProperty('og:image', image);
    this.upsertProperty('og:image:alt', imageAlt);
    this.upsertProperty('og:image:width', '1200');
    this.upsertProperty('og:image:height', '630');

    this.upsertName('twitter:card', 'summary_large_image');
    this.upsertName('twitter:title', fullTitle);
    this.upsertName('twitter:description', opts.description);
    this.upsertName('twitter:image', image);

    if (ogType === 'article' && opts.publishedTime) {
      this.upsertProperty('article:published_time', opts.publishedTime);
    } else {
      this.meta.removeTag("property='article:published_time'");
    }

    if (ogType === 'article' && opts.tags?.length) {
      // article:tag is repeatable; remove old then add fresh.
      this.removeAllProperty('article:tag');
      for (const tag of opts.tags) {
        this.meta.addTag({ property: 'article:tag', content: tag });
      }
    } else {
      this.removeAllProperty('article:tag');
    }

    this.upsertCanonical(url);
  }

  private upsertName(name: string, content: string): void {
    if (this.meta.getTag(`name='${name}'`)) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.addTag({ name, content });
    }
  }

  private upsertProperty(property: string, content: string): void {
    if (this.meta.getTag(`property='${property}'`)) {
      this.meta.updateTag({ property, content });
    } else {
      this.meta.addTag({ property, content });
    }
  }

  private removeAllProperty(property: string): void {
    let tag = this.meta.getTag(`property='${property}'`);
    while (tag) {
      this.meta.removeTagElement(tag);
      tag = this.meta.getTag(`property='${property}'`);
    }
  }

  private upsertCanonical(href: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = href;
  }

  private absoluteUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }
    return SITE_ORIGIN + (pathOrUrl.startsWith('/') ? pathOrUrl : '/' + pathOrUrl);
  }
}

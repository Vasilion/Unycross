import { Post } from '../post.model';
import { post as p01 } from './01-why-nova';
import { post as p02 } from './02-stack';
import { post as p03 } from './03-brain-swap';
import { post as p04 } from './04-voice';
import { post as p05 } from './05-skills';
import { post as p06 } from './06-screener';
import { post as p07 } from './07-ai-picks';
import { post as p08 } from './08-date-hallucination';
import { post as p09 } from './09-production-polish';
import { post as p10 } from './10-lookup';
import { post as p11 } from './11-insider-chips-and-the-no-data-drag';

export const POSTS: Post[] = [p01, p02, p03, p04, p05, p06, p07, p08, p09, p10, p11]
  .slice()
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function findPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

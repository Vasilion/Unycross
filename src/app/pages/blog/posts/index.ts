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
import { post as p12 } from './12-three-audits-three-layers';
import { post as p13 } from './13-what-ten-years-of-bars-said';
import { post as p14 } from './14-what-uber-taught-the-scorers';
import { post as p15 } from './15-one-nova-score-twelve-layers';
import { post as p16 } from './16-options-flow-and-the-silent-401';
import { post as p17 } from './17-same-ticker-two-scores';
import { post as p18 } from './18-drip-for-nova-fund';
import { post as p19 } from './19-role-playing-tool-calls';
import { post as p20 } from './20-twelve-amplify-failures-then-vercel';
import { post as p21 } from './21-nine-paying-members-zero-pro-tier';
import { post as p22 } from './22-auditing-nova-before-her-first-dollar';
import { post as p23 } from './23-three-custom-series-one-revert';
import { post as p24 } from './24-chat-overlay-and-screen-context-bus';
import { post as p25 } from './25-three-popover-gotchas';

export const POSTS: Post[] = [p01, p02, p03, p04, p05, p06, p07, p08, p09, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25]
  .slice()
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function findPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

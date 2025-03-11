import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { whyEverySmallBusinessNeedsaWebsiteIn2025 } from './posts/whyEverySmallBusinessNeedsaWebsiteIn2025';
import { howAWebsiteCanIncreasLeadsForYourSmallBusiness } from './posts/howAWebsiteCanIncreasLeadsForYourSmallBusiness';
import { NavigationService } from '../../../shared/navigation.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIcon],
})
export class BlogPostComponent implements OnInit {
  postId: number;
  post: { title: string; content: string };
  posts = [
    {
      id: 1,
      title: 'Why Every Small Business Needs a Website in 2025',
      content: whyEverySmallBusinessNeedsaWebsiteIn2025,
    },
    {
      id: 2,
      title: 'How a Website Can Increase Leads for Your Small Business',
      content: howAWebsiteCanIncreasLeadsForYourSmallBusiness,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private navService: NavigationService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.postId = +idParam;
      this.fetchPostData(this.postId);
    } else {
      console.error('No post ID provided');
    }
  }

  fetchPostData(postId: number) {
    const post = this.posts.find((post) => post.id === postId);

    if (post) {
      this.post = {
        title: post.title,
        content: post.content,
      };
      console.log('Post content loaded successfully');
    } else {
      console.error(`Post with ID ${postId} not found`);
    }
  }

  navAndScroll(route: string) {
    this.navService.scrollToTop(route);
  }
}

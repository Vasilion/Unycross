import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NavigationService } from '../../shared/navigation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  state = 'visible';
  selectedImage: string | null = null;
  private observer: IntersectionObserver | null = null;

  constructor(private navigationService: NavigationService) {}

  services = [
    {
      title: 'Stand Out with Custom Design',
      description:
        'DIY platforms trap you in cookie-cutter templates that blend into the crowd. With 13 years of expertise, I build bespoke websites that showcase your brand’s personality and vision.',
    },
    {
      title: 'Grow Without Limits',
      description:
        'DIY platforms often struggle to scale as your business grows. Unyx custom solutions, backed by over a decade of development experience, ensure your website adapts seamlessly to increased traffic and new features.',
    },
    {
      title: 'Secure, Supported, and Affordable',
      description:
        'DIY platforms can lack robust security and support. With our competitive pricing and expertise, you get a fast, secure website plus dedicated support value that grows with you.',
    },
  ];
  testimonials = [
    {
      quote:
        'We worked with Unycross to update our website to a more modern, mobile friendly platform. The communication with Luke was great and they did a wonderful job as they tailored it to our business needs. We love the results with a built-in registration system and the user friendly calendar. We would highly recommend Luke Vasilion and everyone at Unycross!',
      author: 'Martin Motocross Park',
    },
    {
      quote:
        'We are extremely pleased with the website Luke Vasilion designed for our company. His creative input and attention to detail were fantastic. He was able to produce a quality website for us in a reasonable amount of time, giving our website the professional look we wanted to achieve in order to stand out above other piano technicians in our area.',
      author: 'Kollar Piano Services',
    },
    {
      quote:
        'As a musician it is imperative to have a website that communicates your brand and who you are. Luke will help you hash out every aspect of your website and will unapologetically ask as many questions as he needs to to get to the bare bones of what your website is being built to do. There really was no detail left behind when they were building my website. Luke and his team were relentless in their pursuit of creating the most efficient website for me and my fans to navigate.',
      author: 'Rollin Brummette',
    },
    {
      quote:
        'Went to Lucas with a basic “feel” I wanted in a website. They helped flush out the visual layout and content. Unycross’s services are a bargain when you weigh the cost versus the product you receive. I will be using them again in future endeavors. Thanks again!',
      author: 'Diesel Fuel Doctor',
    },
    {
      quote:
        'Unycross excels at turning your website dreams into reality. We are so proud of the work they’ve done for us that we have already recommended them to many of our partners. The Unycross team is heads and shoulders above their competition, and we are very thankful that they call Michigan home.',
      author: 'Fresh Start Cleaning',
    },
  ];

  ngOnInit() {
    this.state = 'visible';

    // document.addEventListener('DOMContentLoaded', () => {
    //   const observer = new IntersectionObserver(
    //     (entries) => {
    //       entries.forEach((entry) => {
    //         if (entry.isIntersecting) {
    //           startAnimation();
    //           observer.unobserve(entry.target);
    //         }
    //       });
    //     },
    //     { threshold: 0.2 }
    //   );

    //   observer.observe(document.querySelector('.benefits-container'));

    //   function startAnimation() {
    //     const bars = document.querySelectorAll('.bar-container');

    //     bars.forEach((bar, index) => {
    //       setTimeout(() => {
    //         bar.classList.add('animate');

    //         setTimeout(() => {
    //           const value = bar.getAttribute('data-value');
    //           const barEl = bar.querySelector('.bar') as HTMLElement;
    //           if (barEl) {
    //             barEl.style.width = value + '%';
    //           }
    //         }, 300);
    //       }, index * 200);
    //     });
    //   }
    // });
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver() {
    const benefitsContainer = document.querySelector('.benefits-container');
    if (!benefitsContainer) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startAnimation();
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    this.observer.observe(benefitsContainer);
  }

  private startAnimation() {
    const bars = document.querySelectorAll('.bar-container');
    bars.forEach((bar, index) => {
      setTimeout(() => {
        bar.classList.add('animate');

        setTimeout(() => {
          const value = bar.getAttribute('data-value');
          const barEl = bar.querySelector('.bar') as HTMLElement;
          if (barEl) {
            barEl.style.width = `${value}%`;
          }
        }, 300);
      }, index * 200);
    });
  }

  navAndScroll(route: string) {
    this.navigationService.scrollToTop(route);
  }
}

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [
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
export class ContactComponent implements OnInit {
  state = 'visible';
  loading = false;
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      message: ['', Validators.required],
    });

    this.contactForm
      .get('phoneNumber')
      ?.setValidators([
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(10),
      ]);
  }

  ngOnInit() {
    this.state = 'visible';
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.loading = true;

      const formData = {
        name: this.contactForm.get('name')?.value,
        email: this.contactForm.get('email')?.value,
        phoneNumber: this.contactForm.get('phoneNumber')?.value || '',
        message: this.contactForm.get('message')?.value,
      };

      this.http
        .post(environment.strapiBaseUrl + '/contact/submit', formData)
        .subscribe({
          next: (response) => {
            console.log('Success:', response);
            this.snackBar.open(
              'Thank you for your message! We’ll get back to you soon.',
              'Close',
              {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: ['success-snackbar'],
              }
            );
            this.contactForm.reset();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error Details:', error);

            console.log('Error Details:', error);
            const errorMessage =
              error?.error?.error?.details?.error || 'Something went wrong.';

            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar'],
            });

            this.loading = false;
          },
        });
    } else {
      this.snackBar.open(
        'Please fill out all required fields correctly.',
        'Close',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );
    }
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    this.contactForm.get('phoneNumber')?.setValue(value, { emitEvent: false });
    input.value = value;
  }
}

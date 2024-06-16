import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule, 
  FormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css'], // Debe ser styleUrls en plural
})
export class FormLoginComponent {
  loginForm: FormGroup;

  /* constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router : Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  } */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  /* onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe(
        (response) => {
          console.log('Login successful:', response);
          localStorage.setItem('token', response?.token);
        },
        (error) => {
          console.error('Login failed:', error);
        }
      );
    }
  } */
  login(): void {
    const { username, password } = this.loginForm.value;
    this.authService.login2(username, password).subscribe({
      next: () => this.router.navigate(['dashboard']),
      error: (err) => console.error('error login', err),
    });
  }
}

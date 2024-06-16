import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-docente',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Añade los módulos necesarios aquí
  templateUrl: './docente.component.html',
  styleUrl: './docente.component.css'
})
export class DocenteComponent {
  private apiUrl = 'https://si2parcial.onrender.com/api'; //URL de API
  private tokenKey = 'authToken';
  users:any[] = []; 
  formRegister: FormGroup; 

  constructor(private http: HttpClient,private fb: FormBuilder, private authService:AuthService ) {
    this.formRegister = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      age: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required]
    })
   }

  ngOnInit() { // Asegúrate de implementar OnInit y que esté bien escrito
    this.getUsers().subscribe(
      data => {
        this.users = data
        console.log('Data:', this.users);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  getUsers(): Observable<any> {
    console.log("Fetching users...");

    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/users`, { headers })
      .pipe(
        tap(response => {
          console.log('Users fetched successfully:', response);
        }),
        catchError(error => {
          console.error('Error fetching users:', error);
          return throwError(() => new Error('Error fetching users, please try again later.'));
        })
      );
  }
    createUser(): void {
      if (this.formRegister.valid) {
        const { name, age, email, password, phone } = this.formRegister.value;
        console.log({ name, age, email, password, phone });
    
        this.authService.registerUser(name, email, age, phone, password, 'TEACHER').subscribe(
          response => {
            console.log('User created successfully:', response);
            
            this.formRegister.reset();
          },
          error => {
            console.error('Error creating user:', error);
            alert('Error creating user. Please try again later.');
          }
        );
      } else {
        console.warn('Form is invalid');
        alert('Please fill out the form correctly.');
      }
    }
    
}

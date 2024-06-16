import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-facultad',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './facultad.component.html',
  styleUrl: './facultad.component.css',
})
export class FacultadComponent {
  private apiUrl = 'https://si2parcial.onrender.com/api'; //URL de API
  private tokenKey = 'authToken';
  faculties: any[] = [];
  formRegister: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
  ) {
    this.formRegister = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Asegúrate de implementar OnInit y que esté bien escrito
    this.getFaculties().subscribe(
      (data) => {
        this.faculties = data;
        console.log('Data:', this.faculties);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getFaculties(): Observable<any> {
    console.log('Fetching Faculties...');

    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/faculties`, { headers }).pipe(
      tap((response) => {
        console.log('faculties fetched successfully:', response);
      }),
      catchError((error) => {
        console.error('Error fetching Faculties:', error);
        return throwError(
          () => new Error('Error fetching Faculties, please try again later.')
        );
      })
    );
  }

  createFacultie(): void {
    if (this.formRegister.valid) {
      const { name } = this.formRegister.value;
      console.log({ name });
      const token = localStorage.getItem(this.tokenKey);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.post<any>(`${this.apiUrl}/faculties`, { name},{headers}).subscribe(
        (response) => {
          console.log('facultie created successfully:', response);
         
          this.formRegister.reset();
        },
        (error) => {
          console.error('Error creating facultie:', error);
          alert('Error creating facultie. Please try again.');
        }
      );
    } else {
      console.warn('Form is invalid');
      alert('Please fill out the form correctly.');
    }
  }
}

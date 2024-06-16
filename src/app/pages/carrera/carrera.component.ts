import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-carrera',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Añade los módulos necesarios aquí
  templateUrl: './carrera.component.html',
  styleUrl: './carrera.component.css'
})
export class CarreraComponent implements OnInit  {
  private apiUrl = 'https://si2parcial.onrender.com/api'; //URL de API
  private tokenKey = 'authToken';
  careers:any[] = []; 
  faculties: any[] = [];
  formRegister: FormGroup; 

  constructor(private http: HttpClient,private fb: FormBuilder, private authService:AuthService ) {
    this.formRegister = this.fb.group({
      name: ['', Validators.required],
      sigla: ['', Validators.required],
      facultie: ['', Validators.required],
    })
   }

  ngOnInit() { // Asegúrate de implementar OnInit y que esté bien escrito
    this.getCareers().subscribe(
      data => {
        this.careers = data
        console.log('Data-careers:', this.careers);
      },
      error => {
        console.error('Error:', error);
      }
    );
    this.getFaculties().subscribe(
      (data) => {
        this.faculties = data;
        console.log('Data-faculties:', this.faculties);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getCareers(): Observable<any> {
    console.log("Fetching careers...");

    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/careers`, { headers })
      .pipe(
        tap(response => {
          console.log('careers fetched successfully:', response);
        }),
        catchError(error => {
          console.error('Error fetching careers:', error);
          return throwError(() => new Error('Error fetching careers, please try again later.'));
        })
      );
  }


    createCareer(): void {
      if (this.formRegister.valid) {
        const { name,sigla, facultie } = this.formRegister.value;
        console.log({ name,sigla, facultie });
  
        const token = localStorage.getItem(this.tokenKey);
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
  
        this.http
          .post<any>(
            `${this.apiUrl}/careers`,
            {name, sigla, facultyId: facultie },
            { headers }
          )
          .subscribe(
            (response) => {
              console.log('career created successfully:', response);
  
              this.formRegister.reset();
            },
            (error) => {
              console.error('Error creating career:', error);
              alert('Error creating career. Please try again.');
            }
          );
      } else {
        console.warn('Form is invalid');
        alert('Please fill out the form correctly.');
      }
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
}

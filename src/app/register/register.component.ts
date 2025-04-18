import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'app/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, ReactiveFormsModule, InputTextModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const { username, firstname, email, password } = this.registerForm.value;
      
      this.authService.register(username, firstname, email, password).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Inscription réussie',
            detail: 'Votre compte a été créé avec succès'
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          const errorMessage = err.error?.message || 'Une erreur est survenue lors de l\'inscription';
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur d\'inscription',
            detail: errorMessage
          });
        }
      });
    }
  }
}
// contact.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule,
    CommonModule
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [MessageService]
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      // Ici vous pourriez ajouter un appel HTTP à votre backend
      console.log('Formulaire envoyé', this.contactForm.value);
      
      this.submitted = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Demande de contact envoyée avec succès'
      });
      
      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        this.contactForm.reset();
        this.submitted = false;
      }, 2000);
    }
  }
}
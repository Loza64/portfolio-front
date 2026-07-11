import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form',
  imports: [
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  standalone: true
})
export class FormComponent {

  fg: FormGroup

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private snackbar: MatSnackBar,
  ) {
    this.fg = this.fb.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^(?! )[A-Za-zÀ-ÿ]+( [A-Za-zÀ-ÿ]+)*$/)
        ]
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^(?! )[A-Za-zÀ-ÿ]+( [A-Za-zÀ-ÿ]+)*$/)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)
        ]
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+?[1-9]\d{1,14}([ -]?[\d()]+)*$/)
        ]
      ],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.pattern(/^[a-zA-ZÁ-ÿ0-9\s.,()-]+$/)
        ]
      ],
    });
  }

  isLoading: boolean = false;

  private success() {
    this.snackbar.open('Message sent successfully', '', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private error(data: string) {
    this.snackbar.open(data, '', {
      duration: 5000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private handleValidationError() {
    this.fg.markAllAsTouched();
    this.error("Por favor, completa todos los campos correctamente");
  }

  private handleApiResponse(res: any) {
    if (res.state) {
      this.success();
    } else {
      this.error(res.message);
    }
    this.isLoading = false;
    this.fg.reset();
  }

  private handleErrorResponse(err: any) {
    console.error(err);
    const errorMessage = err?.response?.message || "Ocurrió un error inesperado";
    this.error(errorMessage);
    this.isLoading = false;
  }

  get submitButtonText(): string {
    return this.isLoading ? 'Enviando...' : 'Enviar mensaje';
  }

  onSubmit() {
    this.isLoading = true;

    if (this.fg.invalid) {
      this.isLoading = false;
      this.handleValidationError();
      return;
    }

    this.api.newMessage(this.fg.value).subscribe({
      next: (res) => this.handleApiResponse(res),
      error: (err) => this.handleErrorResponse(err)
    });
  }

}

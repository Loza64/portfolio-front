import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form',
  imports: [
    CommonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {

  fg: FormGroup;
  isLoading = signal(false);

  private readonly errorMessages: Record<string, Record<string, string>> = {
    firstName: {
      required: 'Campo obligatorio',
      minlength: 'Mínimo 2 caracteres',
      pattern: 'Solo letras y espacios',
    },
    lastName: {
      required: 'Campo obligatorio',
      minlength: 'Mínimo 2 caracteres',
      pattern: 'Solo letras y espacios',
    },
    email: {
      required: 'Campo obligatorio',
      email: 'Correo inválido',
      pattern: 'Correo inválido',
    },
    phone: {
      required: 'Campo obligatorio',
      pattern: 'Teléfono inválido',
    },
    message: {
      required: 'Campo obligatorio',
      minlength: 'Mínimo 20 caracteres',
      pattern: 'Caracteres no permitidos',
    },
  };

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private snackbar: MatSnackBar,
  ) {
    this.fg = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^(?! )[A-Za-zÀ-ÿ]+( [A-Za-zÀ-ÿ]+)*$/)
        ]
      ],
      lastName: [
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
    this.isLoading.set(false);
    this.fg.reset();
  }

  private handleErrorResponse(err: any) {
    console.error(err);
    const errorMessage = err?.response?.message || "Ocurrió un error inesperado";
    this.error(errorMessage);
    this.isLoading.set(false);
  }

  get submitButtonText(): string {
    return this.isLoading() ? 'Enviando...' : 'Enviar mensaje';
  }

  get errorCount(): number {
    return Object.values(this.fg.controls)
      .filter((control) => control.invalid && control.touched)
      .length;
  }

  hasError(controlName: string): boolean {
    const control = this.fg.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const control = this.fg.get(controlName);
    if (!control || !control.errors) return '';
    const firstErrorKey = Object.keys(control.errors)[0];
    return this.errorMessages[controlName]?.[firstErrorKey] ?? 'Valor inválido';
  }

  onSubmit() {
    this.isLoading.set(true);

    if (this.fg.invalid) {
      this.isLoading.set(false);
      this.handleValidationError();
      return;
    }

    this.api.newMessage(this.fg.value).subscribe({
      next: (res) => this.handleApiResponse(res),
      error: (err) => this.handleErrorResponse(err)
    });
  }

}

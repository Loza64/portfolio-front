import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { ApiService } from '../../services/api/api.service';

const DEFAULT_ERROR = 'Ocurrió un error inesperado';
const NAME_PATTERN = /^(?! )[A-Za-zÀ-ÿ]+( [A-Za-zÀ-ÿ]+)*$/;

@Component({
  selector: 'app-form',
  imports: [CommonModule, MatSnackBarModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly snackbar = inject(MatSnackBar);

  readonly isLoading = signal(false);

  readonly fg = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(NAME_PATTERN)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(NAME_PATTERN)]],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(/^\w+([._+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/),
      ],
    ],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}([ -]?[\d()]+)*$/)]],
    message: [
      '',
      [
        Validators.required,
        Validators.minLength(20),
        Validators.pattern(/^[a-zA-ZÁ-ÿ0-9\s.,()-]+$/),
      ],
    ],
  });

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

  get submitButtonText(): string {
    return this.isLoading() ? 'Enviando...' : 'Enviar mensaje';
  }

  get errorCount(): number {
    return Object.values(this.fg.controls).filter((control) => control.invalid && control.touched).length;
  }

  hasError(controlName: string): boolean {
    const control = this.fg.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  getErrorMessage(controlName: string): string {
    const errors = this.fg.get(controlName)?.errors;
    if (!errors) return '';
    const firstErrorKey = Object.keys(errors)[0];
    return this.errorMessages[controlName]?.[firstErrorKey] ?? 'Valor inválido';
  }

  onSubmit(): void {
    if (this.isLoading()) return;

    if (this.fg.invalid) {
      this.fg.markAllAsTouched();
      this.notify('Por favor, completa todos los campos correctamente', 'snackbar-error');
      return;
    }

    this.isLoading.set(true);

    this.api.newMessage(this.fg.getRawValue() as never)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.notify('Mensaje enviado correctamente', 'snackbar-success');
          this.fg.reset();
        },
        error: (err: Error) => {
          console.error(err);
          this.notify(err.message || DEFAULT_ERROR, 'snackbar-error');
        },
      });
  }

  private notify(message: string, panelClass: 'snackbar-success' | 'snackbar-error'): void {
    this.snackbar.open(message, '', {
      duration: 5000,
      panelClass: [panelClass],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
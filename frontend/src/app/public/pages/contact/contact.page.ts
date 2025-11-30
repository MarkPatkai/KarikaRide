import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TranslocoModule],
  templateUrl: './contact.page.html'
})
export class ContactPage {}

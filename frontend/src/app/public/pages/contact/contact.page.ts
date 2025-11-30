import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ContactInfoService } from '../../services/contact-info.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TranslocoModule],
  templateUrl: './contact.page.html'
})
export class ContactPage implements OnInit {
  contactInfo: any;

  constructor(private contactInfoService: ContactInfoService) {}

  ngOnInit() {
    this.contactInfoService.getContactInfo().subscribe(data => {
      this.contactInfo = data;
      this.contactInfo.email = this.sanitizeEmail(this.contactInfo.email);
    });
  }

  sanitizeEmail(email: string): string {
    return email.replace(/@/g, '&#64;');
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminListService } from '../basic-service/admin-list.service';
import { AdminManagementComponent } from '../admin-management/admin-management.component';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent implements OnInit {
  admins: any[] = [];

  constructor(private adminService: AdminListService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAdmins().subscribe({
      next: (data) => {
        console.log('Données reçues:', data);
        this.admins = Array.isArray(data) ? data : [];
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
}
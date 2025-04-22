import { Component, OnInit } from '@angular/core';
import { AdminManageService } from '../basic-service/admin-manage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';

// Définition des types
type AdminStatus = 'Active' | 'Inactive' | 'Suspended';

enum Gender {
  Male = 'male',
  Female = 'female'
}

 interface Admin {
  id: number ;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender: Gender;
  phone: string;
  status: AdminStatus;
}


@Component({
  selector: 'app-admin-management',
  standalone: true,
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzModalModule,
    NzIconModule
  ]
})
export class AdminManagementComponent implements OnInit {
  admins: Admin[] = [];
  errorMessage: string = '';
  showAddForm = false;
  isEditMode = false;
  newAdmin: Omit<Admin, 'id'> & { id: number | null } = {
    id: null, 
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    gender: Gender.Male,
    phone: '',
    status: 'Active',
    
  };

  constructor(
    private adminService: AdminManageService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAllAdmins().subscribe({
      next: (data: Admin[]) => {
        this.admins = data;
        this.message.success('Liste des administrateurs chargée');
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement';
        this.message.error(this.errorMessage);
        console.error(err);
      }
    });
  }

  onEditAdmin(admin: Admin): void {
    this.newAdmin = { ...admin };
    this.isEditMode = true;
    this.showAddForm = true;
  }

  onSubmitAdmin(form: NgForm): void {
    if (form.invalid) return;

    if (this.isEditMode && this.newAdmin.id !== null) {
      this.adminService.updateAdmin(this.newAdmin.id, this.newAdmin as Admin).subscribe({
        next: () => {
          this.message.success('Administrateur modifié avec succès');
          this.resetForm();
          this.loadAdmins();
        },
        error: (err) => {
          this.message.error('Erreur lors de la modification');
          console.error(err);
        }
      });
    } else {
      this.adminService.addAdmin(this.newAdmin).subscribe({
        next: () => {
          this.message.success('Administrateur ajouté avec succès');
          this.resetForm();
          this.loadAdmins();
        },
        error: (err) => {
          this.message.error("Erreur lors de l'ajout");
          console.error(err);
        }
      });
    }
  }

  resetForm(): void {
    this.newAdmin = {
      id: null,
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      gender: Gender.Male,
      phone: '',
      status: 'Active'
    };
    this.isEditMode = false;
    this.showAddForm = false;
  }

  onStatusChange(id: number, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as AdminStatus;
    this.adminService.updateStatus(id, status).subscribe({
      next: () => {
        this.message.success('Statut mis à jour');
        this.loadAdmins();
      },
      error: (err) => {
        this.message.error('Erreur de mise à jour du statut');
        console.error(err);
      }
    });
  }

  confirmDeleteAdmin(id: number): void {
    this.modal.confirm({
      nzTitle: 'Confirmer la suppression',
      nzContent: 'Voulez-vous vraiment supprimer cet administrateur ?',
      nzOkText: 'Oui',
      nzCancelText: 'Non',
      nzOnOk: () => this.deleteAdmin(id)
    });
  }

  deleteAdmin(id: number): void {
    this.adminService.deleteAdmin(id).subscribe({
      next: () => {
        this.message.success('Administrateur supprimé');
        this.loadAdmins();
      },
      error: (err) => {
        this.message.error('Erreur lors de la suppression');
        console.error(err);
      }
    });
  }
}
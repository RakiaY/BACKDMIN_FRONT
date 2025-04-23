import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
//OnInit: pour exécuter une action au chargement.
import { AdminListService } from '../basic-service/admin-list.service';
import { AdminManagementComponent } from '../admin-management/admin-management.component';
import { FormGroup, FormsModule , FormBuilder,Validators, ReactiveFormsModule, NgForm} from '@angular/forms';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
// Removed NzOptionModule as it is not exported by ng-zorro-antd/select

type AdminStatus = 'Active' | 'Inactive' | 'Suspended';

enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'

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
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule, // Ajout crucial
    NzModalModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule
    // Removed NzOptionModule
    ],
  templateUrl:'./admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent implements OnInit {
  admins: any[] = [];
  statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Pending', label: ' Pending' },
    { value: 'Deleted', label: 'Deleted' },
    { value: 'Blocked', label: 'Blocked' }
  ];
  adminForm!: FormGroup;
  isModalVisible = false;
  isEditMode = false;
  currentAdminId: number | null = null;
  newAdmin: Omit<Admin, 'id'> & { id: number | null } = {
    id: null, 
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    gender: Gender.Female,
    phone: '',
    status: 'Active',
    
  };
  errorMememssage: string = '';
  showAddForm = false;

  constructor(private adminService: AdminListService ,
    private modal: NzModalService,
    private fb: FormBuilder,
        private message: NzMessageService,
    

  ) {}

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
  viewAdmin(adminId: number): void {
    this.adminService.getAdminById(adminId).subscribe({
      next: (response) => {
        const admin = response.admin;
        const permissions = response.permissions;
        const createdAt = response.created_at;
        const updatedAt = response.updated_at;
        const deletedAt = response.deleted_at ?? 'Non supprimé';

        if (admin) {
          this.modal.info({
            nzTitle: 'Détails de l\'Administrateur',
            nzContent: `
              <p><strong>Name :</strong> ${admin.first_name} ${admin.last_name}</p>
              <p><strong>Email :</strong> ${admin.email}</p>
              <p><strong>Phone :</strong> ${admin.phone}</p>
              <p><strong>Gender :</strong> ${admin.gender}</p>
              <p><strong>Birth_Date :</strong> ${admin.birth_date}</p>
              <p><strong>Statut :</strong> ${admin.status}</p>
              <p><strong>permissions :</strong> ${permissions.length ? permissions.join(', ') : 'Aucune'}</p>
              <p><strong>createdAt :</strong> ${createdAt}</p>
              <p><strong>updatedAt :</strong> ${updatedAt}</p>
              <p><strong>deletedAt :</strong> ${deletedAt}</p>


            `,
            nzOnOk: () => console.log('Popup fermé')
          });
        } else {
          this.modal.error({
            nzTitle: 'Erreur',
            nzContent: 'Administrateur non trouvé.'
          });
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'admin :', err);
        this.modal.error({
          nzTitle: 'Erreur serveur',
          nzContent: 'Impossible de charger les données.'
        });
      }
    });
  }
  
  updateStatus(adminId: number, newStatus: string): void {
    const admin = this.admins.find(a => a.id === adminId);
    if (!admin) return;

    const oldStatus = admin.status;
    admin.status = newStatus; // Mise à jour immédiate pour l'UI

    this.adminService.updateStatus(adminId, newStatus).subscribe({
      error: (err) => {
        console.error('Erreur:', err);
        admin.status = oldStatus; // Revert en cas d'erreur
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
      gender: Gender.Female,
      phone: '',
      status: 'Active'
    };
    this.isEditMode = false;
    this.showAddForm = false;
  }

    
    
}
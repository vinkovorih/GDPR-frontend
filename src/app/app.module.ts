import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {CdkTableModule} from '@angular/cdk/table';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatGridListModule, MatIconModule, MatInputModule,
  MatListModule, MatPaginatorIntl,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTableModule,
  MatToolbarModule, MatTooltipModule
} from "@angular/material";
import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './index/register/register.component';
import {NewPost, PortalComponent, ViewPostDialog} from './index/portal/portal.component';
import {PortalAdminComponent} from './index/portal/portal-admin/portal-admin.component';
import { CatalogComponent } from './index/catalog/catalog.component';
import { HeaderComponent } from './index/header/header.component';
import { FooterComponent } from './index/footer/footer.component';
import {RouterModule} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthGuard} from "./services/auth.guard";
import {PortalService} from "./services/portal.service";
import {DataService} from "./services/data.service";
import {BasicInterceptor} from "./services/basic-interceptor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserService} from "./services/user.service";
import {GrowlModule} from "primeng/growl";
import {ConfirmDialogModule, OverlayPanelModule, SidebarModule} from "primeng/primeng";
import {ConfirmationService} from "primeng/api";
import {TableModule} from "primeng/table";
import {ImageUploadModule} from "angular2-image-upload";
import {ImageCropperModule} from "ngx-image-cropper";
import { SafeHtmlPipe } from './index/portal/safe-html.pipe';
import {EditPassword, EditUser, PortalProfileComponent} from './index/portal/portal-profile/portal-profile.component';
import {DialogModule} from "primeng/dialog";
import { BugreportComponent } from './index/portal/bugreport/bugreport.component';
import {AdminGuard} from "./services/admin.guard";
import {NewProcessDialog, ProcessComponent} from './index/catalog/process/process.component';
import {NewRoleDialog, RolesComponent} from "./index/catalog/process/roles/roles.component";
import {
  DataDescriptionDialog,
  GdprComponent, NewAppDialog, NewDataDialog,
  NewPDataDialog
} from "./index/catalog/process/roles/gdpr/gdpr.component";
import {ApplicationsComponent} from "./index/catalog/applications/applications.component";
import {PersonalDataComponent} from "./index/catalog/personal-data/personal-data.component";
import { DepartmentsComponent } from './index/catalog/departments/departments.component';
import { UsersComponent } from './index/portal/portal-admin/users/users.component';
import { NewsComponent } from './index/portal/portal-admin/news/news.component';
import {DepsComponent, NewDepartment} from './index/portal/portal-admin/deps/deps.component';
import {GdprGuard} from "./services/gdpr.guard";
import {ProcessGuard} from "./services/process.guard";
import {RolesGuard} from "./services/roles.guard";
import {MatPaginatorIntlCro} from "./classes/matPaginatorIntlCro";

@NgModule({
  declarations: [
    IndexComponent,
    RegisterComponent,
    PortalComponent,
    PortalAdminComponent,
    CatalogComponent,
    HeaderComponent,
    FooterComponent,
    NewPost,
    NewDepartment,
    EditUser,
    EditPassword,
    NewPDataDialog,
    NewProcessDialog,
    NewRoleDialog,
    NewDataDialog,
    NewAppDialog,
    ViewPostDialog,
    DataDescriptionDialog,
    SafeHtmlPipe,
    PortalProfileComponent,
    BugreportComponent,
    ProcessComponent,
    RolesComponent,
    GdprComponent,
    PersonalDataComponent,
    ApplicationsComponent,
    DepartmentsComponent,
    UsersComponent,
    NewsComponent,
    DepsComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatListModule,
    MatTooltipModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    GrowlModule,
    TableModule,
    ConfirmDialogModule,
    DialogModule,
    OverlayPanelModule,
    SidebarModule,
    HttpClientModule,
    ImageUploadModule.forRoot(),
    ImageCropperModule,
    RouterModule.forRoot(
      [
        {
          path:'',
          component: PortalComponent,
        },
        {
          path:'register',
          component: RegisterComponent,
        },
        {
          path:'report',
          component: BugreportComponent,
          canActivate:[AuthGuard]
        },
        {
          path:'portal/profile/:id',
          component: PortalProfileComponent,
          canActivate:[AuthGuard]
        },
        {
          path:'portal-admin',
          component: PortalAdminComponent,
          canActivate:[AdminGuard]
        },
        {
          path:'catalog',
          component: CatalogComponent,
          canActivate:[AuthGuard]
        },
        {
          path:'process/:id',
          component: ProcessComponent,
          canActivate:[ProcessGuard]
        },
        {
          path:'role/:id',
          component: RolesComponent,
          canActivate:[RolesGuard]
        },
        {
          path:'gdpr/:idpr/:idro',
          component: GdprComponent,
          canActivate:[GdprGuard]
        },
        {
          path:'department',
          component: DepartmentsComponent,
          canActivate:[AdminGuard]
        },
        {
          path:'**',
          component: PortalComponent
        }
      ]
    )
  ],
  providers: [PortalService, ConfirmationService,DataService,UserService,AuthGuard,AdminGuard,RolesGuard,ProcessGuard,GdprGuard,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: BasicInterceptor,
    multi: true
  },
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlCro
    }
    ],
  entryComponents: [NewPost, NewDepartment,EditUser,EditPassword,NewProcessDialog,NewRoleDialog,NewPDataDialog,NewDataDialog,NewAppDialog,DataDescriptionDialog,ViewPostDialog],
  bootstrap: [IndexComponent]
})
export class AppModule { }

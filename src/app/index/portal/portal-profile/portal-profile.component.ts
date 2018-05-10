import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {ConfirmationService, Message} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {PasswordValidation} from "../../register/register.component";
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-portal-profile',
  templateUrl: './portal-profile.component.html',
  styleUrls: ['./portal-profile.component.css']
})
export class PortalProfileComponent implements OnInit {
  msgs: Message[] = [];
  constructor(private route:ActivatedRoute,
              private router:Router,
              private user:UserService,
              private cs: ConfirmationService,
              private dialog: MatDialog) { }
    sampleImg: string = '../../../../assets/images/sample.png';
    showChangePhoto:boolean = false;
    profile:any;
    showcropper: boolean = false;
    imageChangedEvent: any = '';
    croppedImage:any;
    id: any;
  ngOnInit() {
    this.route.params.subscribe((params: Params) =>{
      this.id = params['id'];
      this.user.getInfoAboutUser(this.id).subscribe(res => {
        this.profile = res;
      });
    })
  }

  backToPortal(){
    this.router.navigate(['']);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.showcropper = true;
    this.showChangePhotoDialog();
  }

  imageCropped(image: string) {
    this.croppedImage = image;
  }

  showChangePhotoDialog(){
    this.showChangePhoto = true;
  }

  updatePictureForUser(){
    this.showChangePhoto = false;
    this.user.updatePictureForUser(this.croppedImage,this.id).subscribe(res => {
      this.msgs.push({severity:'info', summary:res});
      this.ngOnInit();
    });
  }

  editUser(){
    let dialogRef;
    dialogRef = this.dialog.open(EditUser, {
      width: '600px',
      height: '600px',
      data: this.profile
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.user.updateUser(result).subscribe(res=>{
          this.msgs = [];
          this.msgs.push({severity:'info', summary:res});
        });
      }
    });
  }

  changePassword(){
    let dialogRef;
    dialogRef = this.dialog.open(EditPassword, {
      width: '600px',
      height: '500px',
      data: {
        password:'',
        password2:'',
        id:this.profile.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.msgs.push({severity:'info',summary:result});
        setTimeout(()=>{
          this.user.user = null;
          this.router.navigate(['']);
        },1000);
      }
    });
  }

  deleteUser(){
    this.cs.confirm({
      message: 'Želite li trajno obrisati račun?',
      key:'danger',
      accept: () => {
        this.user.deleteUser(this.profile.id).subscribe(res=>{
          this.msgs = [];
          this.msgs.push({severity:'info', summary:res});
          this.user.user = null;
          setTimeout(() => {
            this.router.navigate(['']);
          },2500);
        });
      }
    });

  }
}


@Component({
  selector:'edit-user-dialog',
  templateUrl:'editUserDialog.html',
  styleUrls: ['./dialogs.css']
})
export class EditUser {
  controller: FormGroup;
  constructor(public fb: FormBuilder,
              private user: UserService,
              public dialogRef: MatDialogRef<EditUser>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.controller = this.fb.group({
      username: [{value: '', disabled: true}, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required,Validators.email])]
    });
  }

  update(data) {
    this.user.updateUser(data).subscribe(res=>{
    });
  }
}


@Component({
  selector:'edit-password-dialog',
  templateUrl:'editPasswordDialog.html',
  styleUrls: ['./dialogs.css']
})
export class EditPassword {
  private secret: string = 'TVZ';
  controller: FormGroup;
  constructor(public fb: FormBuilder,
              private user: UserService,
              public dialogRef: MatDialogRef<EditPassword>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.controller = this.fb.group({
      password: ['', Validators.required],
      password2: ['', Validators.required],
    },{validator: PasswordValidation.MatchPassword});
  }

  update(data) {
    data.password = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(data.password));
    let obj = {
      username: data.id.toString(),
      password: data.password
    };
    this.user.updatePassword(obj).subscribe(res => {
    });
  }
}

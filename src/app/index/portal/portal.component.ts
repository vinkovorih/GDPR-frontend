import {AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {PortalService} from "../../services/portal.service";
import {OverlayPanel} from "primeng/primeng";
import {UserService} from "../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ConfirmationService, Message} from "primeng/api";

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.css']
})
export class PortalComponent implements OnInit, AfterViewInit {
  //varijable
  toggleHeart:boolean = false;
  @Input('data') likes = [];
  msgs: Message[] = [];
  tiles: any = [];
  tile: any = '';
  likesOfUser: any = [];
  showSidebar: boolean = false;
  //constructor
  constructor(private portal:PortalService,private confirmationService:ConfirmationService, public user:UserService, private dialog:MatDialog) {
    this.showSidebar = false;
  }

  ngOnInit() {
    this.getPosts();
  }

  ngAfterViewInit(){
    if(this.user.user != null) this.getLikes();
  }

  getLikes(){
    this.portal.getLikes().subscribe(res => {this.likesOfUser = res;
      });
  }

  getPosts() {
    this.portal.getPosts().subscribe(res => {
      this.tiles = res;
    });
  }

  //overlay
  selectedTile(tile: any) {
    let dialogRef;
    dialogRef = this.dialog.open(ViewPostDialog, {
      width: '800px',
      data: tile
    });

    dialogRef.afterClosed().subscribe();
  }

  //dialog
  addPost(){
    let dialogRef;
    dialogRef = this.dialog.open(NewPost, {
      width: '600px',
      height: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getPosts();
        this.msgs = [];
        this.msgs.push({severity:'info', summary:"Uspješno dodavanje posta!"});
      }
    });
  }

  addLike(id){
    this.portal.likeDislikePost(id).subscribe(res=>{
      this.msgs = [];
      if(this.likes.indexOf(id) > -1)
      this.likes.splice(id,1);
      else
        this.likes.push(id);
      this.msgs.push({severity:'info', summary:res});
    });
  }

  deletePost(id){
    this.confirmationService.confirm({
      message: 'Želite li obrisati navedeni post?',
      key:'portal',
      accept: () => {
        this.portal.deletePost(id).subscribe(res=>{
          this.msgs = [];
          this.msgs.push({severity:'info', summary:res});
        });
      }
    });

  }
}


@Component({
  selector:'new-post-dialog',
  templateUrl:'newPostDialog.html',
  styleUrls: ['./dialogs.css']
})
export class NewPost {
  controller: FormGroup;
  showcropper: boolean = false;
  imageChangedEvent: any = '';
  croppedImage:any;
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(public fb: FormBuilder,
              public portal: PortalService,
              private user: UserService,
              public dialogRef: MatDialogRef<NewPost>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.showcropper = true;
  }

  imageCropped(image: string) {
    this.croppedImage = image;
  }


  createForm() {
    this.controller = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      large: ['', Validators.required],
    });
  }

  add(data) {
    data.author = this.user.user.username;
    data.date = 0;
    data.image = this.croppedImage;
    if (this.controller.valid) {
      this.portal.addPost(data).subscribe();
    }
  }
}


@Component({
  selector:'view-post-dialog',
  templateUrl:'viewPostDialog.html',
  styleUrls: ['./dialogs.css']
})
export class ViewPostDialog {
  constructor(public dialogRef: MatDialogRef<ViewPostDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

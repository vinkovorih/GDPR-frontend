import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PortalService} from "../../services/portal.service";
import {UserService} from "../../services/user.service";
import {User} from "../../classes/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService, Message} from "primeng/api";
import {Router} from "@angular/router";
import * as crypto from 'crypto-js';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() event = new EventEmitter<string>();
  msgs: Message[] = [];
  private secret: string = 'TVZ';
  controller: FormGroup;
  message: string = '';
  login:{
    username,
    password
  };
  constructor(public portal: PortalService, public user:UserService, private fb: FormBuilder, private confirmationService:ConfirmationService, private router:Router) {
    this.login = {
      username: '',
      password: ''
    };
    this.createForm();
  }
  createForm(){
    this.controller = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }



  logout(){
    this.confirmationService.confirm({
      message: 'Jeste li sigurni?',
      key:'logout',
      accept: () => {
        this.user.user = null;
        this.router.navigate(['']);
      }
    });

  }

  ngOnInit() {
  }

  loginUser(){
    this.login.password = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(this.login.password));
    this.user.loginUser(this.login).subscribe(res => {
      this.user.user = res;
      this.event.emit("Get likes!");
      this.showInfo();
    },
      error => {
        if(error.status ==401){
          console.clear();
          this.message = "Neispravno korisničko ime ili lozinka";
          this.showError();
        }
        else{
          this.message = "Došlo je do pogreške u komunika";
          this.showError();
        }
      })
  }

  showInfo() {
    this.msgs = [];
    this.msgs.push({severity:'info', summary:'Uspješna prijava!', detail:this.message});
  }

  showError() {
    this.msgs = [];
    this.msgs.push({severity:'error', summary:'Greška!', detail:this.message});
  }

}

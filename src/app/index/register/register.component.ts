import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {DataService} from "../../services/data.service";
import {Router} from "@angular/router";
import * as crypto from 'crypto-js';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  msgs: Message[] = [];
  private secret: string = 'TVZ';
  passwordRepeat: any = '';
  register: any = {};
  deps: any = [];
  message: any = '';
  controller: FormGroup;
  constructor(private user:UserService,private fb:FormBuilder,private data:DataService, public router: Router) {
    this.createForm();
  }

  ngOnInit() {
      this.prepareDeps();
  }

  prepareDeps(){
    this.user.getDeps().subscribe(res => {
      this.deps = res;
    });
  }

  createForm(){
    this.controller = this.fb.group({
      firstname: ['',Validators.required],
      lastname: ['',Validators.required],
      username: ['',Validators.required],
      email: ['',Validators.compose([Validators.required,Validators.email])],
      password: ['',Validators.required],
      password2: ['',Validators.required],
      deps: ['',Validators.required]
    },{validator: PasswordValidation.MatchPassword})
    }


  registerUser(){
    this.register.password = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(this.register.password));
    this.user.registerUser(this.register).subscribe(res=> {
        this.message = res;
        this.showInfo();
        setTimeout(()=>{
          this.router.navigate(['/']);
        },3000);
      },
      error => {
        if(error.status ==422){
          console.clear();
          this.message = error;
          this.showError();
        }
        else{
          this.message = error;
          this.showError();
        }
    })
  }

  showInfo() {
    this.msgs = [];
    this.msgs.push({severity:'info', detail:this.message});
  }

  showError() {
    this.msgs = [];
    this.msgs.push({severity:'error',  detail:this.message});
  }
}

import {AbstractControl} from '@angular/forms';
import {Message} from "primeng/api";
export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value;
    let confirmPassword = AC.get('password2').value;
    if(password != confirmPassword) {
      AC.get('password2').setErrors( {MatchPassword: true} )
    } else {
      return null
    }
  }
}

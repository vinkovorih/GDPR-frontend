import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {User} from "../classes/user";

@Injectable()
export class UserService {
  user: any = null;
  constructor(private http:HttpClient) {}
  loginUser(login): Observable<any>{
   return this.http.post<any>('/api/portal/login',login);
  }

  getDeps(): Observable<any>{
    return this.http.get<any>('/api/portal/deps');
  }

  registerUser(register): Observable<any>{
    return this.http.post('/api/portal/register',register,{responseType:'text'});
  }

  getUsers():Observable<any>{
    return this.http.get<any>('/api/portal/users');
  }

  deleteUser(id):Observable<any>{
    let url = '/api/portal/users/'+id;
    return this.http.delete(url, {responseType:'text'});
  }

  changeAuthorities(id):Observable<any>{
    let url = '/api/portal/users/'+id;
    return this.http.put(url, {}, {responseType:'text'});
  }

  deleteDeps(id):Observable<any>{
    let url = '/api/portal/deps/'+id;
    return this.http.delete(url,{responseType:'text'});
  }

  addDeps(data): Observable<any>{
    let url = '/api/portal/deps';
    return this.http.post(url,data,{responseType:'text'});
  }

  getInfoAboutUser(id): Observable<any>{
    let url = '/api/portal/users/' +id;
    return this.http.get(url);
  }

  updatePictureForUser(img,id): Observable<any>{
    let url = '/api/portal/user/'+id;
    let obj = {
      img: img
    };
    return this.http.put(url, obj, {responseType:'text'});
  }

  updateUser(profile): Observable<any>{
    return this.http.post('/api/portal/user',profile,{responseType: 'text'});
  }
  updatePassword(obj): Observable<any>{
    return this.http.put('/api/portal/user',obj,{responseType:'text'});
  }
}




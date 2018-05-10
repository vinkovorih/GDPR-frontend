import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {UserService} from "./user.service";

@Injectable()
export class PortalService {

  constructor(private http: HttpClient, private user:UserService) { }

  getPosts(): Observable<any>{
    return this.http.get('/api/portal/news');
  }

  getLikes(): Observable<any>{
    let url = '/api/portal/likes/'+this.user.user.id;
    return this.http.get<any>(url);
  }

  addPost(data): Observable<any>{
    return this.http.post('/api/portal/news',data, {responseType:'text'});
  }

  likeDislikePost(id):Observable<any>{
    let url = '/api/portal/news/'+id + "/"+this.user.user.id;
    return this.http.put(url, {},{responseType:'text'});
  }

  deletePost(id):Observable<any>{
    let url = '/api/portal/news/'+id;
    return this.http.delete(url,{responseType:'text'});
  }

  reportBug(error): Observable<any>{
      return this.http.post('/api/report',error,{responseType:'text'});
  }
}

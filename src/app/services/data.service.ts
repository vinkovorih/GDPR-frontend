import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class DataService {

  constructor(private http:HttpClient) {

  }
  dep: any = 0;
  process: any = 0;
  role: any = 0;


  getProcessesOfDep(id): Observable<any>{
    let url = 'api/catalog/processes/'+id;
    return this.http.get<any>(url);
  }

  newProcess(data):Observable<any>{
    return this.http.post('/api/catalog/processes',data,{responseType:'text'});
  }

  getRolesOfProcess(id): Observable<any>{
    let url = 'api/catalog/roles/'+id;
    return this.http.get<any>(url);
  }

  newRole(data): Observable<any>{
    return this.http.post('/api/catalog/roles',data, {responseType:'text'});
  }

  getApplications(): Observable<any>{
    return this.http.get<any>('api/catalog/applications')
  }

  getPersonalData(): Observable<any>{
    return this.http.get<any>('api/catalog/personaldata')
  }

  getGDPRdata(idpr, idro): Observable<any>{
    let url = `api/catalog/gdpr/${idpr}/${idro}/`;
    return this.http.get<any>(url);
  }

  newData(data):Observable<any>{
    return this.http.post('api/catalog/personaldata',data,{responseType:'text'});
  }

  newApplication(data):Observable<any>{
    return this.http.post('api/catalog/applications',data,{responseType:'text'});
  }

  newGdprEntry(data): Observable<any>{
    return this.http.post('api/catalog/gdpr',data,{responseType:'text'});
  }

  getApplicationsOfPD(id): Observable<any>{
    let url = `api/catalog/gdpr/${id}`;
    return this.http.get<any>(url);
  }
}


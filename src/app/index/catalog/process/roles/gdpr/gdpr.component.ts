import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {DataService} from "../../../../../services/data.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator} from "@angular/material";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {DataSource} from "@angular/cdk/collections";
import {Message} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../../../services/user.service";
import {NewRoleDialog} from "../roles.component";

@Component({
  selector: 'app-gdpr',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.css']
})
export class GdprComponent implements OnInit {

  msgs: Message[] = [];
  process: any = this.data.process.name;
  role: any = this.data.role.name;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  displayedColumns: any = ['id','name','needed','third'];
  dataSource: TableDataSource;
  gdpr: any[] = [];
  apps: any[] = [];
  pd: any[] = [];


  idpr: any = null;
  idro: any = null;

  constructor(private route:ActivatedRoute, private router:Router, private data:DataService, private dialog:MatDialog) { }

  ngOnInit() {
    this.getApps();
    this.getPersonalData();
    this.getGdprData();
  }

  private getApps() {
    this.data.getApplications().subscribe(res => {
      this.apps = res;
    });
  }
  private getPersonalData(){
    this.data.getPersonalData().subscribe(res=>{
      this.pd = res;
    });
  }
  private getGdprData(){
    this.route.params.subscribe((params:Params) => {
      this.idpr = params['idpr'];
      this.idro = params['idro'];
        this.data.getGDPRdata(this.idpr, this.idro).subscribe(res=>{
          this.gdpr = res;
          this.dataSource = new TableDataSource(res,this.paginator);
          Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
              if (!this.dataSource) {
                return;
              }
              this.dataSource.filter = this.filter.nativeElement.value;
            });
        });
    });
  }
  selectedpd(row){    let dialogRef;
    this.data.getApplicationsOfPD(row.id).subscribe(res => {
      let apps = res;
    dialogRef = this.dialog.open(DataDescriptionDialog, {
      width: '400px',
      data: {
        pdName: row.pdName,
        pd: this.pd,
        needed: row.needed,
        third: row.third,
        apps: apps
      }
      });
    });

  }

  backToRoles(){
    window.history.back();
  }

  addGDPR(){
    let dialogRef;
    dialogRef = this.dialog.open(NewPDataDialog, {
      width: '600px',
      height: '500px',
      data: {
        fkpd: '',
        fkpr: this.idpr,
        fkrole: this.idro,
        needed: false,
        third: false,
        applications: [],
        apps: this.apps,
        pd: this.pd
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Uspješno dodavanje osobnog podatka u ulogu!'});
        this.getGdprData();
      }
    });
  }
  addPD(){
    let dialogRef;
    dialogRef = this.dialog.open(NewDataDialog, {
      width: '600px',
      height: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Uspješno dodavanje novog osobnog podatka!'});
        this.getPersonalData();
      }
    });
  }
  addAPP(){
    let dialogRef;
    dialogRef = this.dialog.open(NewAppDialog, {
      width: '600px',
      height: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Uspješno dodavanje novog sustava!'});
        this.getApps();
      }
    });
  }
}


export class TableDataSource extends DataSource<any>{
  _filterChange = new BehaviorSubject('');
  get filter(): string {
    return this._filterChange.value;
  }
  set filter(filter: string) {
    this._filterChange.next(filter);
  }
  filteredData: any =[];

  constructor(private data: any, private paginator: MatPaginator){
    super();
  }
  connect(): Observable<any[]>{
    const displayDataChanges = [
      this.data,
      this._filterChange,
      this.paginator.page
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      this.filteredData = this.data.slice().filter((item: any) => {
        const searchStr = (item.pdName).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return this.filteredData.splice(startIndex,this.paginator.pageSize);
    })
  }
  disconnect(){}
}

@Component({
  selector:'new-pdata-dialog',
  templateUrl:'newPDataDialog.html',
  styleUrls: ['./dialogs.css']
})
export class NewPDataDialog {
  controllerA: FormGroup;
  constructor(
    public fb: FormBuilder,
    public save:DataService,
    private user: UserService,
    public dialogRef: MatDialogRef<NewPDataDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createAddForm();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  createAddForm(){
    this.controllerA = this.fb.group({
      fkpd: ['',Validators.required],
      apps: ['', Validators.required],
      needed: [''],
      third: ['']
    });
  }
  add(data){
    if(this.controllerA.valid){
      this.save.newGdprEntry(data).subscribe(res=>{});
      setTimeout(()=> {
      },2500);
    }
  }
}

@Component({
  selector:'new-data-dialog',
  templateUrl:'newDataDialog.html',
  styleUrls: ['./dialogs.css']
})
export class NewDataDialog {
  controllerA: FormGroup;
  constructor(
    public fb: FormBuilder,
    public save:DataService,
    private user: UserService,
    public dialogRef: MatDialogRef<NewDataDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createAddForm();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  createAddForm(){
    this.controllerA = this.fb.group({
      name: ['',Validators.required],
      desc: ['',Validators.required]
    });
  }
  add(data){
    if(this.controllerA.valid){
      this.save.newData(data).subscribe();
      setTimeout(()=> {
      },2500);
    }
  }
}

@Component({
  selector:'new-app-dialog',
  templateUrl:'newAppDialog.html',
  styleUrls: ['./dialogs.css']
})
export class NewAppDialog {
  controllerA: FormGroup;
  constructor(
    public fb: FormBuilder,
    public save:DataService,
    private user: UserService,
    public dialogRef: MatDialogRef<NewAppDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createAddForm();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  createAddForm(){
    this.controllerA = this.fb.group({
      name: ['',Validators.required],
      desc: ['',Validators.required],
      owner: ['',Validators.required]
    });
  }
  add(data){
    if(this.controllerA.valid){
      this.save.newApplication(data).subscribe();
      setTimeout(()=> {
      },2500);
    }
  }
}

@Component({
  selector:'data-description-dialog',
  templateUrl:'DataDescriptionDialog.html',
  styleUrls: ['./dialogs.css']
})
export class DataDescriptionDialog {
  constructor(
    public dialogRef: MatDialogRef<DataDescriptionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../../../services/data.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NewProcessDialog, TableDataSource} from "../process.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator} from "@angular/material";
import {Observable} from "rxjs/Rx";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../../services/user.service";
import {Message} from "primeng/api";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  constructor(private data:DataService, private route:ActivatedRoute, private router:Router, private dialog:MatDialog) { }
  process: any = this.data.process.name;
  msgs: Message[] = [];
  displayedColumns = ['id','name','desc'];
  dataSource: TableDataSource;
  roles: any[] = [];
  id: any = null;
  ngOnInit() {
    this.route.params.subscribe((params:Params) => {
      this.id = params['id'];
      this.getRoles(this.id);
    });
  }

  private getRoles(id: any) {
    this.data.getRolesOfProcess(id).subscribe(res => {
      this.roles = res;
      this.dataSource = new TableDataSource(res, this.paginator);
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
  }

  addRow(){
    let dialogRef;
    dialogRef = this.dialog.open(NewRoleDialog, {
      width: '600px',
      height: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Uspješno dodavanje uloge!'});
        this.getRoles(this.id);
      }
    });
  }

  backToProcesses(){
    this.router.navigate(['process', this.id]);
  }


  selectRole(row){
    this.data.role = row;
    this.router.navigate(['gdpr',this.id,row.id])
  }
}


@Component({
  selector:'new-role-dialog',
  templateUrl:'newRoleDialog.html',
  styleUrls: ['./dialogs.css']
})
export class NewRoleDialog {
  controllerA: FormGroup;
  constructor(
    public fb: FormBuilder,
    public save:DataService,
    private user: UserService,
    public dialogRef: MatDialogRef<NewRoleDialog>,
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
    });
  }
  add(data){
    if(this.controllerA.valid){
      data.fkpr = this.save.process.id;
      this.save.newRole(data).subscribe(res=>{});
      setTimeout(()=> {
      },2500);
    }
  }
}

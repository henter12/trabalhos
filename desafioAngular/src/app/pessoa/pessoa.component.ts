import { Component } from '@angular/core';
import { PessoaFormComponent } from './pessoa-form/pessoa-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PessoaServiceService } from './services/pessoa-service.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pessoa',
  templateUrl: './pessoa.component.html',
  styleUrls: ['./pessoa.component.scss']
})
export class PessoaComponent {


  displayedColumns: string[] = [ "name" ,'peso', 'altura', 'dataNascimento', 'action'];
  dataSource = new MatTableDataSource<any>;

  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  };

  constructor(
    public dialog: MatDialog,
    public api: PessoaServiceService,
    private _snackBar: MatSnackBar  
  ){};  

  ngOnInit(): void {   
    this.getPessoaList(this.pageEvent);  
  }

  openDialog( id?: number, mode?: string){
    return this.dialog.open(PessoaFormComponent, {
      width: "25%",       
      data: { id, mode },      
    }).afterClosed().subscribe(() => {  
      this.getPessoaList(this.pageEvent);  
    })
  }

  getPessoaList(event: PageEvent){
    let params = new HttpParams()
    .set('_page', this.pageEvent.pageIndex)
    .set('_limit', this.pageEvent.pageSize)

    this.api.getAllPessoa(params).subscribe({
      next: (res): void => {         
        this.dataSource = res;
        this.pageEvent.length = res.length;
      }
    })
  }

  deletPessoa(pessoaId: number) {    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: "Tem certeza que deseja excluir?",
    });  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result){
        this.api.deletePessoa(pessoaId).subscribe({
          next: () => {
            this.getPessoaList(this.pageEvent);
            this._snackBar.open("Dados salvos com sucesso!!", '', {duration: 2000});
          },
          error: (error) => {
            console.log(error)
          }
        })    
      }
    });
  };
}

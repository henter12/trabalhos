import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PessoaServiceService } from '../services/pessoa-service.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pessoa-form',
  templateUrl: './pessoa-form.component.html',
  styleUrls: ['./pessoa-form.component.scss']
})
export class PessoaFormComponent {
  mode!: string;
  id!: number;
  formPessoa!: FormGroup;
  pessoa: any;

  constructor(  
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PessoaFormComponent>,    
    public api: PessoaServiceService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar   
  ) { }
  
  ngOnInit(): void { 
     
    this.mode = this.data.mode;
    this.id = this.data.id;    

    this.formPessoa = this.formBuilder.group({
     
      nome:[''],
      peso:['',],
      altura:['',],      
      nascimento:['',],      
    })

    switch (this.mode) {
      case 'create':
        this.formPessoa.enable();        
        break;

      case 'view':
        this.formPessoa.disable();
        this.getPessoaId();
        break;

      case 'edit':
        this.formPessoa.enable();        
        this.getPessoaId();
        break;   
    }
  }
  private getPessoaId(): void {
    this.api.getIdPessoa(this.id)
      .subscribe({
        next: (res: any) => {          
          this.formPessoa.patchValue(res);         
        },
        error: (error) => {
          console.log(error)       
        }
      })
  }

  addPessoa() {    
    const values = this.formPessoa.value;
    if (this.formPessoa.invalid ) {
      this.formPessoa.markAllAsTouched();
      return;
    }    
    if(this.mode === 'create'){
      this.api.postPessoa(values).subscribe({
        next: () => {
          this.formPessoa.reset();
          this.dialogRef.close();
          this._snackBar.open("Dados salvos com sucesso!!", '', {duration: 2000});
        },
        error: (error) => {          
          console.log(error)
        },
      });
    }else
      this.save();
  };

  save(){
    const values = this.formPessoa.value;
    this.api.updatePessoa(this.pessoa, values).subscribe({
      next: () => {
        this.dialogRef.close();
        this._snackBar.open("Dados salvos com sucesso!!", '', {duration: 2000, });
      },
      error: (error: any) => {        
        console.log(error);
      },
    });    
  }

  changeToEdit(): void {
    this.mode = "edit";
    this.formPessoa.enable();
  }


  exit(): void {  
      this.dialogRef.close();
  }}
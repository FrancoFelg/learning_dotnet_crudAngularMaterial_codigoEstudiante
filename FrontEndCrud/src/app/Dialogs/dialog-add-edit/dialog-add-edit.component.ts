import { Component ,OnInit} from '@angular/core';
import {FormBuilder,FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DATE_FORMATS} from "@angular/material/core";
import * as moment from 'moment';
import { Departamento } from 'src/app/Interfaces/departamento';
import { Empleado } from 'src/app/Interfaces/empleado';
import { DepartamentoService } from 'src/app/Services/departamento.service';
import { EmpleadoService } from 'src/app/Services/empleado.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display:{
    dateInput: "DD/MM/YYYY",
    montYearLabel: "MMMM YYYY",
    dateA11yLabel: "LL",
    monthyearA11yLabel: "MMMM YYYY"
  }
}

@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrls: ['./dialog-add-edit.component.css'],
  providers: [
    {provide : MAT_DATE_FORMATS, useValue : MY_DATE_FORMATS}
  ]
})

//Al iniciar la clase, se genera el Dialog
export class DialogAddEditComponent implements OnInit {
  formEmpleado: FormGroup;
  tituloAccion: string="Nuevo";
  botonAccion: string= "Guardar";
  listaDepartamentos: Departamento[] = []

  constructor(//Arma el Dialog
    private dialogoReferencia: MatDialogRef<DialogAddEditComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _departamentoServicio: DepartamentoService,
    private _empleadoService : EmpleadoService
  ){//Settea los valores y requeridos del Dialog
    this.formEmpleado = this.fb.group({
      nombreCompleto: ['', Validators.required],
      idDepartamento: ['', Validators.required],
      sueldo: ['', Validators.required],
      fechaContrato: ['', Validators.required]
    });

this._departamentoServicio.getList().subscribe({
  next:(data)=>{
    this.listaDepartamentos= data;
  }, error: (e)=>{}
})

  }

  mostrarAlerta(msg: string, accion: string){
    this._snackBar.open(msg, accion,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration: 3000
    });
  }

  addEditEmpleado(){
    

    console.log(this.formEmpleado.value)
    //Se crea el modelo del empleado y se rellena con los datos del formulario
    const modelo : Empleado ={
      idEmpleado:0,
      nombreCompleto: this.formEmpleado.value.nombreCompleto,
      idDepartamento: this.formEmpleado.value.idDepartamento,
      sueldo: this.formEmpleado.value.sueldo,
      fechaContrato: moment(this.formEmpleado.value.fechaContrato).format("DD/MM/YYYY")
    }

    this._empleadoService.add(modelo).subscribe({
      next:(data)=>{
        this.mostrarAlerta("Empleado fue creado", "Listo");
        this.dialogoReferencia.close("Creado");
      },error:(e)=>{
        this.mostrarAlerta("No se pudo crear", "Error");
      }
    })
      
    ;

  }

  ngOnInit(): void{

  }
}

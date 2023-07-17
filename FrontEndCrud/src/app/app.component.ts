import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';


import { Empleado } from './Interfaces/empleado';
import { EmpleadoService } from './Services/empleado.service';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { DialogAddEditComponent } from './Dialogs/dialog-add-edit/dialog-add-edit.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DialogoDeleteComponent } from './Dialogs/dialogo-delete/dialogo-delete.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit, OnInit {
  title = 'FrontEndCrud';
  displayedColumns: string[] = ['NombreCompleto', 'Departamento', 'Sueldo', 'FechaContrato', 'Acciones'];
  dataSource = new MatTableDataSource<Empleado>();

  @ViewChild(MatPaginator)paginator!: MatPaginator;
  
  constructor(private empleadoService: EmpleadoService,
    public dialog:MatDialog,
    private _snackBar:MatSnackBar){

  }

  //Se ejecuta al inicio del render
  ngOnInit(): void {
    this.mostrarEmpleados();
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  mostrarEmpleados(){
    this.empleadoService.getList().subscribe({
      next:(dataResponse) => { //dataResponse es lo que se obtiene del método getList()        
        this.dataSource.data = dataResponse;
      }, error:(e) => {}
    });
  }

  dialogoNuevoEmpleado(){
    this.dialog.open(DialogAddEditComponent, {
      disableClose:true,
      width:"350px"
    }).afterClosed().subscribe(resultado =>{
      if(resultado === "Creado"){
        this.mostrarEmpleados();
      }
    })
  }

  dialogoEditarEmpleado(dataEmpleado: Empleado){
    this.dialog.open(DialogAddEditComponent, {
      disableClose:true,
      width:"350px",
      data:dataEmpleado
    }).afterClosed().subscribe(resultado =>{
      if(resultado === "Creado" || resultado === "Editado" ){
        this.mostrarEmpleados();
      }
    })
  }

  mostrarAlerta(msg: string, accion: string){
    this._snackBar.open(msg, accion,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration: 3000
    });
  }

  dialogoEliminarEmpleado(dataEmpleado: Empleado){
    this.dialog.open(DialogoDeleteComponent, {
      disableClose:true,
      data:dataEmpleado
    }).afterClosed().subscribe(resultado =>{
      if(resultado === "Eliminar"){
        this.empleadoService.delete(dataEmpleado.idDepartamento).subscribe({
          next:(data)=>{
            this.mostrarAlerta("El empleado fue eliminado", "Listo");
            this.mostrarEmpleados();
          },
          error:(e)=> {console.log(e)}
        })
        
      }
    })
  }


}



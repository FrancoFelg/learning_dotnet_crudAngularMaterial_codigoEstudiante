import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit{

  columnasTabla: string[] =["nombreCompleto", "correo", "rolDescripcion", "estado", "acciones"];
  dataInicio:Usuario[] = [];
  dataListaUsuarios= new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ){}

    obtenerUsuarios(){            
      this._usuarioServicio.lista().subscribe({
        next: (data) => {          
          if(data.status){//si el status es true
            this.dataListaUsuarios.data = data.value;//Se rellena en la lista el valor obtenido del get
          }else{//Si no, muestra una alerta
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
          }
        },        
        error:(e) => {}
      })
    }

  //Al iniciar se cargan los usuarios
  ngOnInit(): void {
    this.obtenerUsuarios();  
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;    
  }

  //recibe un evento, del cual se obtiene el valor y se lo almacena
  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();//se filtra segun el valor, sacándole los espacios y en minúsculas
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true//hace que no se cierre el modal si clickeamos fuera
    }).afterClosed().subscribe(resultado => {
      if(resultado == "true") this.obtenerUsuarios();      
    });
  }

  editarUsuario(usuario:Usuario){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,//hace que no se cierre el modal si clickeamos fuera
      data:usuario
    }).afterClosed().subscribe(resultado => {
      if(resultado == "true") this.obtenerUsuarios();      
    });
  }

  eliminarUsuario(usuario:Usuario){
    Swal.fire({
      title: "¿Desea eliminar el usuario?",
      text: usuario.nombreCompleto,
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "No, volver"
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._usuarioServicio.eliminar(usuario.idUsuario).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El usuario fue eliminado", "Listo");
              this.obtenerUsuarios();
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el usuario", "Error");
            }
          },
          error:(e)=>{}
        })
      }
    })
  }
}

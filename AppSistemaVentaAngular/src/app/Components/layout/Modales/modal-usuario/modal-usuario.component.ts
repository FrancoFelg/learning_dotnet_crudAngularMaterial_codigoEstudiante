import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';

import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';


@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit{

  formularioUsuario:FormGroup;
  ocultarPassword:boolean = true;
  tituloAccion:string = "Agregar";
  botonAccion:string = "Guardar";
  listaRoles:Rol[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario:Usuario,
    private fb:FormBuilder,
    private _rolServicio: RolService,
    private _usuarioservicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {    
    //En caso de que sea Agregar, por defecto
    this.formularioUsuario = this.fb.group({
      nombreCompleto : ["", Validators.required],
      correo : ["", Validators.required],
      idRol : ["", Validators.required],
      clave : ["", Validators.required],
      esActivo : ["1 ", Validators.required]
    });

    //Si los datos del usuario no son nulos entonces es editar, ergo se pone
    if(this.datosUsuario != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";      
    }

    this._rolServicio.lista().subscribe({
      next:(data) =>{
        if(data.status) this.listaRoles = data.value
      },
      error:(e)=>{}
    })

  }

  ngOnInit(): void {//carga los valores por defecto en caso de que sea actualizar
    if(this.datosUsuario != null){
      this.formularioUsuario.patchValue({
        nombreCompleto : this.datosUsuario.nombreCompleto,
        correo : this.datosUsuario.correo,
        idRol : this.datosUsuario.IdRol,
        clave : this.datosUsuario.clave,
        esActivo : this.datosUsuario.esActivo.toString()
      })
    }
  }

  guardarEditar_Usuario(){
    const _usuario: Usuario = {
      idUsuario : this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto : this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      IdRol: this.formularioUsuario.value.IdRol,
      rolDescripcion : "",
      clave: this.formularioUsuario.value.clave,      
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }

    if(this.datosUsuario == null){//Crear
      this._usuarioservicio.guardar(_usuario).subscribe({
        next: (data) =>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El usuario fue registrado", "Extio");
            this.modalActual.close("true");
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el usuario", "Error")            
          }
        },
        error:(e) => {}
      })
    }else{//Editar
      this._usuarioservicio.editar(_usuario).subscribe({
        next: (data) =>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El usuario fue editado", "Extio");
            this.modalActual.close("true");
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo editar el usuario", "Error")            
          }
        },
        error:(e) => {}
      })
    }
  }

}

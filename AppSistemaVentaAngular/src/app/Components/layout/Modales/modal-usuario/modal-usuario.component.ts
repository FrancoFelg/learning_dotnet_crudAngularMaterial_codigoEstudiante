import { Component, OnInit, Inject} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  //Inicialización de variables
  formularioUsuario:FormGroup; //Formulario que envía datos del objeto actual
  ocultarPassword:boolean = true;//si se muestra u oculta la contraseña
  tituloAccion: string = "Agregar";//Titulo de la tarjeta
  botonAccion: string = "Guardar";//Texto del boton
  listaRoles: Rol[] = [];//Lista de roles, luego se rellena con un Get del RolService



  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,//Este componente va a ser un modal
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,//asigna como datos del modal a el objeto Usuario
    private fb: FormBuilder ,//Va a permitir rellenar los datos del formulario
    private _rolServicio:RolService,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio: UtilidadService
  ){
    this.formularioUsuario = this.fb.group({//Crea los campos del formulario
     nombreCompleto : ["", Validators.required],
     correo : ["", Validators.required],
     idRol : ["", Validators.required],
     clave : ["", Validators.required],
     esActivo : ["1", Validators.required],
    })
    //En caso de que ya haya datos recibidos en el modal, vamos a cambiar el contenido del texto de titulo y del boton
    if(this.datosUsuario != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    //Rellenar la lista de roles
    this._rolServicio.lista().subscribe({
      next: (data) => {
        //Si el status es true, lo rellena con el valor retornado
        if(data.status) this.listaRoles = data.value;        
      },
      //si hay un error retorna lista vacía
      error:(e) => {}
    })
  
  }

  //Se ejecuta al inicio, al cargar el modal
  ngOnInit(): void {
    //si hay datos, hay que rellenar los campos con los valores del usuario obtenidos
    if(this.datosUsuario != null){
      this.formularioUsuario.patchValue({
        nombreCompleto : this.datosUsuario.nombreCompleto,
        correo : this.datosUsuario.correo,
        idRol : this.datosUsuario.idRol,
        clave : this.datosUsuario.clave,
        esActivo : this.datosUsuario.esActivo.toString(),
      })
    }
  }

  guardarEditar_Usuario(){
    const _usuario: Usuario = {
      idUsuario : this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: "",
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }

    //Si los datos son nulos, guarda y muestra un mensaje de éxito
    if(this.datosUsuario == null){
      this._usuarioServicio.guardar(_usuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El usuario fue registrado", "Exito")
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el usuario", "Error")
          }          
        },
        error:(e) => {}
      })
    }else{
      this._usuarioServicio.editar(_usuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El usuario fue editado", "Exito")
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo editar el usuario", "Error")
          }          
        },
        error:(e) => {}
      })
    }

  }
    
  

}

import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Login} from "src/app/Interfaces/login";
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { Usuario } from 'src/app/Interfaces/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  formularioLogin:FormGroup;
  ocultarPassword:boolean = true;
  mostrarLoading:boolean=false;

constructor( 
  private fb:FormBuilder,
  private router: Router,
  private _usuarioServicio:UsuarioService,
  private _utilidadServicio:UtilidadService
  ) {
    this.formularioLogin = this.fb.group({
      email:["",Validators.required],
      password:["",Validators.required]
    });

}

  ngOnInit(): void {
    
  }

  IniciarSesion(){
    this.mostrarLoading = true;
    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave:this.formularioLogin.value.password
    }

    this._usuarioServicio.iniciarSesion(request).subscribe({ //ejecuta el método y subscribe obtiene el resultado
      next: (data) =>{ //data es el resultado

        if(data.status){
          this._utilidadServicio.guardarSesionUsuario(data.value);
          this.router.navigate(["pages"])
        }else{
          this._utilidadServicio.mostrarAlerta("No se encontraron coincidencias", "Oops!")
        }

      },
      complete: () => {
        this.mostrarLoading = false;
      },
      error : () => {
        this._utilidadServicio.mostrarAlerta("Hubo un error", "Oops!")
      }
              
    })
  }

}

import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {Departamento} from '../Interfaces/departamento';


@Injectable({
  providedIn: 'root'
})

export class DepartamentoService {

  private endPoint:string = environment.endPoint; //se obtiene la variable desde el entorno
  private apirUrl:string = this.endPoint+"departamento/";//Se concatena al endpoint actual ""departamento"


  constructor(private http:HttpClient) {}

  getList():Observable<Departamento[]>{//se observa una peticion
    return this.http.get<Departamento[]>(`${this.endPoint}lista`);//Se hace un get a la url+lista
  }
}

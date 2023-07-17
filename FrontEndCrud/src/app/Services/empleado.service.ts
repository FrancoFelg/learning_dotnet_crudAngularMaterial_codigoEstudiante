import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import { Empleado } from '../Interfaces/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  
  private endPoint:string = environment.endPoint; //se obtiene la variable desde el entorno
  private apirUrl:string = this.endPoint+"empleado/";//Se concatena al endpoint actual ""departamento"


  constructor(private http:HttpClient) {}

  getList():Observable<Empleado[]>{//se observa una peticion
    return this.http.get<Empleado[]>(`${this.endPoint}lista`);//Se hace un get a la url+lista
  }

  add(modelo:Empleado):Observable<Empleado>{
    return this.http.post<Empleado>(`${this.apirUrl}guardar`,modelo); //Se envía el modelo a la url
  }

  update(idEmpleado:number, modelo:Empleado):Observable<Empleado>{
    return this.http.put<Empleado>(`${this.apirUrl}actualizar/${idEmpleado}`, modelo); 
  }

  delete(idEmpleado:number):Observable<Empleado>{
    return this.http.delete<Empleado>(`${this.apirUrl}eliminar/${idEmpleado}`);
  }
}

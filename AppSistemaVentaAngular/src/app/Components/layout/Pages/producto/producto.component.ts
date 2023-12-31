import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';


import { Producto } from 'src/app/Interfaces/producto';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { ModalProductoComponent } from '../../modales/modal-producto/modal-producto.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit{

  columnasTabla: string[] =["nombre", "categoria", "stock", "precio","estado", "acciones"];
  dataInicio:Producto[] = [];
  dataListaProductos= new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _ProductoServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ){
    
  }

  obtenerProductos(){      
    this._ProductoServicio.lista().subscribe({
      next: (data) => {          
        if(data.status){//si el status es true
          this.dataListaProductos.data = data.value;//Se rellena en la lista el valor obtenido del get
        }else{//Si no, muestra una alerta
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },        
      error:(e) => {}
    })
  }



  ngOnInit(): void {
    this.obtenerProductos(); 
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;    
  }

  
  //recibe un evento, del cual se obtiene el valor y se lo almacena
  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLocaleLowerCase();//se filtra segun el valor, sacándole los espacios y en minúsculas
  }

  nuevoProducto(){
    this.dialog.open(ModalProductoComponent, {
      disableClose: true//hace que no se cierre el modal si clickeamos fuera
    }).afterClosed().subscribe(resultado => {
      if(resultado == "true") this.obtenerProductos();      
    });
  }

  editarProducto(producto:Producto){
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,//hace que no se cierre el modal si clickeamos fuera
      data:producto
    }).afterClosed().subscribe(resultado => {
      if(resultado == "true") this.obtenerProductos();      
    });
  }

  eliminarProducto(producto:Producto){
    Swal.fire({
      title: "¿Desea eliminar el producto?",
      text: producto.nombre,
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "No, volver"
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._ProductoServicio.eliminar(producto.idProducto).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El producto fue eliminado", "Listo");
              this.obtenerProductos();
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el producto", "Error");
            }
          },
          error:(e)=>{}
        })
      }
    })
  }

}

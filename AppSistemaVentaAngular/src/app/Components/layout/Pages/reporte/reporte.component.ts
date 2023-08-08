import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import * as XLSX from "xlsx";

import { Reporte } from 'src/app/Interfaces/reporte';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

//Esta configuración es para mostrar las fechas con formato
export const MY_DATA_FORMATS = {
  parse:{
    dataInput: "DD/MM/YYYY"
  },
  display:{
    dataInput: "DD/MM/YYYY",
    monthYearLabel: "MMMM YYYY"//Mes y año se muestran completos
  }
  
}

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}
  ]
})
export class ReporteComponent  implements OnInit{
  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = ["fechaRegistro", "numeroVenta", "tipoPago","total","producto","cantidad", "precio","totalProducto"];
  dataVentaReporte = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private fb:FormBuilder,    
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ){
    this.formularioFiltro = this.fb.group({      
      fechaInicio: ["",Validators.required],
      fechaFin: ["",Validators.required]
    })
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;    
  }

  buscarVentas(){
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format("DD/MM/YYYY");
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format("DD/MM/YYYY");

    if(_fechaInicio === "Invalid date" ||_fechaFin === "Invalid date" ){
      this._utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas", "Oops");
      return;
    }

    this._ventaServicio.reporte(
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next: (data) => {
        if(data.status){
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        }else{
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops");
        }
      },
      error: (e) => {}
    })    
  
  }

  //permite exportar un excel en base a un array
  exportarExcel(){
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte);
      XLSX.utils.book_append_sheet(wb,ws,"Reporte");
      XLSX.writeFile(wb,"Reporte Ventas.xlsx");
  }

  
  

}

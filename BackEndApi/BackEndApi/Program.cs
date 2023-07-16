using BackEndApi.Models;
using Microsoft.EntityFrameworkCore;
using BackEndApi.Services.Contrato;
using BackEndApi.Services.Implementación;
using BackEndApi.Utilidades;
using AutoMapper;
using BackEndApi.DTOs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.AddDbContext<DbempleadoContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("cadenaSQL"));
});

builder.Services.AddScoped<IDepartamentoService, DepartamentoService>();
builder.Services.AddScoped<IEmpleadoService, EmpleadoService>();

builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

builder.Services.AddCors(options => options.AddPolicy("NuevaPolitica", app => {
    app.AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod();
} ) ) ;

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

#region Peticiones Api Rest
    app.MapGet("/departamento/lista", async ( //retorna una lista de Departamentos
    IDepartamentoService _departamentoServicio,
    IMapper _mapper
    ) =>
    {
        var listaDepartamento = await _departamentoServicio.GetList();
        var listaDepartamentoDto = _mapper.Map<List<DepartamentoDTO>>(listaDepartamento);
        if (listaDepartamentoDto.Count > 0)
        {
            return Results.Ok(listaDepartamentoDto);
        }
        else
        {
            return Results.NotFound();
        }
    });


    app.MapGet("/empleado/lista", async ( //retorna una lista de Empleados
        IEmpleadoService _empleadoService, //Se inyectan los servicios necesarios
        IMapper _mapper
    ) =>
    {
        var listaEmpleado = await _empleadoService.GetList();//Obtiene la lista
        var listaEmpleadoDto = _mapper.Map<List<DepartamentoDTO>>(listaEmpleado); //Mapea la lista a dto
        if (listaEmpleadoDto.Count > 0)//En caso de haber resultados
        {
            return Results.Ok(listaEmpleadoDto);//Los retorna
        }
        else
        {
            return Results.NotFound();//Si no hay resultados, retorna 404
        }
    });

    app.MapPost("/empleado/guardar", async (
        EmpleadoDTO modelo, //Obtengo el model a guardar 
        IEmpleadoService _empleadoService, //Se inyectan los servicios necesarios
        IMapper _mapper
        ) => {
            var _empleado = _mapper.Map<Empleado>(modelo);
            var _empleadoCreado = await _empleadoService.Add(_empleado);

            if(_empleadoCreado.IdEmpleado != 0) //Si existe el empleado
                return Results.Ok(_mapper.Map<EmpleadoDTO>(_empleadoCreado) ) ; //Se retorna mapeado a DTO
            else
                return Results.StatusCode(StatusCodes.Status500InternalServerError);//Si no, retorna error 500

        });

    app.MapPut("/empleado/actualizar/{idEmpleado}", async (
        int idEmpleado, //Obtengo el id del modelo a actualizar
        EmpleadoDTO modelo, //Obtengo el modelo
        IEmpleadoService _empleadoService, //Se inyectan los servicios necesarios
        IMapper _mapper
        ) => {
            var _encontrado = await _empleadoService.Get(idEmpleado);
            if(_encontrado is null) return Results.NotFound();

            var _empleado = _mapper.Map<Empleado>(modelo);
            _encontrado.NombreCompleto = _empleado.NombreCompleto;
            _encontrado.IdDepartamento= _empleado.IdDepartamento;
            _encontrado.Sueldo = _empleado.Sueldo;
            _encontrado.FechaContrato = _empleado.FechaContrato;

            var respuesta = await _empleadoService.Update(_encontrado);

            if (respuesta)
                return Results.Ok(_mapper.Map<EmpleadoDTO>(_encontrado));
            else
                return Results.StatusCode(StatusCodes.Status500InternalServerError);
        });
    
    app.MapDelete("/empleado/eliminar/{idEmpleado}", async (
        int idEmpleado,
        IEmpleadoService _empleadoService        
        ) => {

            var _encontrado = await _empleadoService.Get(idEmpleado);
            if (_encontrado is null) return Results.NotFound();

            var respuesta = await _empleadoService.Delete(_encontrado);
            if(respuesta)
                return Results.Ok(respuesta);
            else
                return Results.StatusCode(StatusCodes.Status500InternalServerError);
        });

#endregion Peticiones Api Rest    

app.UseCors("NuevaPolitica");

app.Run();

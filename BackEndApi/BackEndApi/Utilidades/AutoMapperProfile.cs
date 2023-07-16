using AutoMapper;
using BackEndApi.DTOs;
using BackEndApi.Models;
using System.Globalization;


namespace BackEndApi.Utilidades
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() {
            #region Departamento
            CreateMap<Departamento, DepartamentoDTO>().ReverseMap();
            #endregion Departamento

            #region Empleado
            CreateMap<Empleado, EmpleadoDTO>()
                .ForMember(empleado => empleado.NombreDepartamento, //En el campo NombreDepartamento, le vas a asignar
                    opt => opt.MapFrom(empleado => empleado.IdDepartamentoNavigation.Nombre)//Del Empleado, del departamento, el nombre del departamento
                )
                .ForMember(empleado => empleado.FechaContrato, //En el campo FechaContrato, le vas a asignar
                    opt => opt.MapFrom(empleado => empleado.FechaContrato.Value.ToString("dd/MM/yyyy"))//Del Empleado, de la fecha de contrato, el valor de la fecha de contrato con formato dd/MM/yyyy
                );

            CreateMap<EmpleadoDTO, Empleado>()
                .ForMember(empleado =>
                    empleado.IdDepartamentoNavigation,
                    opt => opt.Ignore())
                .ForMember(empleado =>
                    empleado.FechaContrato,
                    opt => opt.MapFrom(empleadoDto => DateTime.ParseExact(empleadoDto.FechaContrato, "dd/MM/yyyy", CultureInfo.InvariantCulture))
                );

            #endregion Empleado
        }


    }
}

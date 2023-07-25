﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using SistemaVenta.DTO;
using SistemaVenta.Model;

namespace SistemaVenta.Utility
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() {
            #region Rol
            CreateMap<Rol, RolDTO>().ReverseMap();
            #endregion Rol

            #region Menu
            CreateMap<Menu, MenuDTO>().ReverseMap();
            #endregion Menu

            #region Usuario
            CreateMap<Usuario, UsuarioDTO>()
                .ForMember(destino => destino.RolDescripcion, opt => opt.MapFrom(origen => origen.IdRolNavigation.Nombre))
            #endregion Usuario
        }
    }
}

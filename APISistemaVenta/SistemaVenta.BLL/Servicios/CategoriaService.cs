using AutoMapper;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.BLL.Servicios
{
    public class CategoriaService : ICategoriaService
    {
        private readonly IGenericRepository<Rol> _rolRepository;
        private readonly IMapper _mapper;

        public CategoriaService(
            IGenericRepository<Rol> rolRepository,
            IMapper mapper
            )
        {
            _rolRepository = rolRepository;
            _mapper = mapper;
        }

        public async Task<List<CategoriaDTO>> Lista()
        {
            try
            {
                var listaCategorias = await _rolRepository.Consultar();
                return _mapper.Map<List<CategoriaDTO>>(listaCategorias.ToList());
            }
            catch
            {
                throw;
            }
        }
    }
}

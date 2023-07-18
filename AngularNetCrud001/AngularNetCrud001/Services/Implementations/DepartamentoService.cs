using AngularNetCrud001.Models;
using AngularNetCrud001.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AngularNetCrud001.Services.Implementations
{
    public class DepartamentoService : IDepartamentoService
    {
        private DbempleadoContext _dbContext;

        public DepartamentoService(
            DbempleadoContext dbContext
            )
        {
            _dbContext = dbContext;
        }

        public Task<List<Departamento>> GetAll()
        {
            try
            {
                return _dbContext.Departamentos.ToListAsync();
            }
            catch ( Exception ex )
            {
                throw ex;
            }
            
        }
    }
}

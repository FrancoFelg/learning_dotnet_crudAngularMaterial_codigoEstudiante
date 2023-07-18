using AngularNetCrud001.Models;
using AngularNetCrud001.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AngularNetCrud001.Services.Implementations
{
    public class EmpleadoService : IEmpleadoService
    {
        private DbempleadoContext _dbContext;

        public EmpleadoService(
            DbempleadoContext dbContext
            )
        {
            _dbContext = dbContext;
        }

        public async Task<List<Empleado>> GetAll()
        {
            try
            {                
                return await _dbContext.Empleados
                    .Include(x => x.IdDepartamentoNavigation).ToListAsync(); ;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Empleado?> GetById(int idEmpleado)
        {
            try
            {                
                return _dbContext.Empleados
                    .Include(dpt => dpt.IdDepartamentoNavigation)
                    .Where(e => e.IdEmpleado == idEmpleado).FirstOrDefault();

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Empleado> Add(Empleado model)
        {
            try
            {
                _dbContext.Empleados.Add(model);
                await _dbContext.SaveChangesAsync();
                return model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> Update(Empleado model)
        {
            try
            {
                _dbContext.Empleados.Update(model);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> Delete(Empleado model)
        {
            try
            {
                _dbContext.Empleados.Remove(model);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
       
        
    }
}

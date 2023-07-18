using AngularNetCrud001.Models;

namespace AngularNetCrud001.Services.Interfaces
{
    public interface IEmpleadoService
    {
        Task<List<Empleado>> GetAll();
        Task<Empleado> GetById(int idEmpleado);
        Task<Empleado> Add(Empleado model);
        Task<bool> Update(Empleado model);
        Task<bool> Delete(Empleado model);
    }
}

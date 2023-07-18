using AngularNetCrud001.Models;

namespace AngularNetCrud001.Services.Interfaces
{
    public interface IDepartamentoService
    {
        Task<List<Departamento>> GetAll();
    }
}

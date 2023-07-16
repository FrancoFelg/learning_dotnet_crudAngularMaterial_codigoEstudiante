using BackEndApi.Services.Contrato;
using BackEndApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEndApi.Services.Implementación
{
    public class DepartamentoService : IDepartamentoService //Interfaz implementada
    {
        private DbempleadoContext _dbContext; //Contexto / Acceso a BBDD

        public DepartamentoService(DbempleadoContext dbContext) //Constructor, inyecta el contexto
        {
            _dbContext = dbContext;
        }

        public async Task<List<Departamento>> GetList() //Servicio GetAll
        {
            try{
                List<Departamento> lista = new List<Departamento>();//Instancia
                lista = await _dbContext.Departamentos.ToListAsync();//Rellena / Inicializa
                return lista; //Retorna el valor

            }catch(Exception ex) {
                throw ex;
            }

        }
    }
}

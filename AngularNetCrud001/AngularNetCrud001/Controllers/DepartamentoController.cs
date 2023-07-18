using AngularNetCrud001.Models;
using AngularNetCrud001.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AngularNetCrud001.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartamentoController : Controller
    {
        private readonly IDepartamentoService _departamentoService;

        public DepartamentoController(
            IDepartamentoService departamentoService
            )
        {
            _departamentoService = departamentoService;
        }

        [HttpGet]
        [Route("getAll")]
        public async  Task<List<Departamento>> GetAll()
        {
            return await _departamentoService.GetAll();
        }
    }
}

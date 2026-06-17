using Microsoft.AspNetCore.Mvc;


namespace MysticBox.Api.Controllers

{ 
    [ApiController]
    [Route("api/categorias")]

    public class CategoriasController : ControllerBase 
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Ver categorias");
        }
    }
}

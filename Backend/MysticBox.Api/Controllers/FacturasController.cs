using Microsoft.AspNetCore.Mvc;


namespace MysticBox.Api.Controllers

{
    [ApiController]
    [Route("api/facturas")]

    public class FacturasController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Ver facturas");
        }
    }
}
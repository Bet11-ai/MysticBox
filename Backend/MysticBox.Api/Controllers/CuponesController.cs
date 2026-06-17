using Microsoft.AspNetCore.Mvc;


namespace MysticBox.Api.Controllers

{
    [ApiController]
    [Route("api/cupones")]

    public class CuponesController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Ver cupones");
        }
    }
}
using Microsoft.AspNetCore.Mvc;


namespace MysticBox.Api.Controllers

{
    [ApiController]
    [Route("api/mysticbox")]

    public class MysticBoxController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Ver catalogo");
        }
    }
}
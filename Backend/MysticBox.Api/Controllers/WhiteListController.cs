using Microsoft.AspNetCore.Mvc;


namespace MysticBox.Api.Controllers

{
    [ApiController]
    [Route("api/whitelist")]

    public class WhiteListController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Ver whitelist");
        }
    }
}
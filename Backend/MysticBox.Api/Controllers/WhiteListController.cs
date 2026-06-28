using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.InterfacesLN;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;


namespace MysticBox.Api.Controllers

{
    [ApiController]
    [Route("api/whiteList")]

    public class WhiteListController : ControllerBase
    {
        private readonly IWhiteListLN _whiteListLN;

        public WhiteListController(IWhiteListLN whiteListLN)
        {
            _whiteListLN = whiteListLN;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var whiteList = await _whiteListLN.ObtenerWhiteLists();
            return Ok(whiteList);
        }

        [HttpGet("{idWhiteList}")]
        public async Task<IActionResult> ObtenerWhiteListPorId(int idWhiteList)
        {
            var whiteList = await _whiteListLN.ObtenerWhiteListPorId(idWhiteList);

            if (whiteList == null)
            {
                return NotFound();
            }
            return Ok(whiteList);
                }

        [HttpPost]
        public async Task<IActionResult> CrearWhiteList([FromBody] WhiteListDTO whiteListDTO)
        {
            var whiteList = await _whiteListLN.CrearWhiteList(whiteListDTO);

            return Ok(whiteList);
        }

        [HttpPut("{idWhiteList}")]
        public async Task<IActionResult> ActualizarWhiteList(int idWhiteList, [FromBody] WhiteListDTO whiteListDTO)
        {
            var resultado = await _whiteListLN.ActualizarWhiteList(idWhiteList, whiteListDTO);

            if (!resultado)
                return NotFound();

            return Ok(resultado);
        }

        [HttpDelete("{idWhiteList}")]
        public async Task<IActionResult> EliminarWhiteList(int idWhiteList)
        {
            var resultado = await _whiteListLN.EliminarWhiteList(idWhiteList);

            if (!resultado)
                return NotFound();

            return Ok(resultado);
        }
    }
}
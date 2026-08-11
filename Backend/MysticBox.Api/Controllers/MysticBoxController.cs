using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.Api.Controllers
{
    [ApiController]
    [Route("api/mysticbox")]
    public class MysticBoxController : ControllerBase
    {
        private readonly IMysticBoxLN _mysticBoxLN;

        public MysticBoxController(IMysticBoxLN mysticBoxLN)
        {
            _mysticBoxLN = mysticBoxLN;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var cajas = await _mysticBoxLN.ObtenerMysticBoxes();
            return Ok(cajas);
        }

        [HttpGet("{idCaja}")]
        public async Task<IActionResult> ObtenerMysticBoxPorId(int idCaja)
        {
            var caja = await _mysticBoxLN.ObtenerMysticBoxPorId(idCaja);
            return caja == null ? NotFound() : Ok(caja);
        }

        [HttpPost]
        public async Task<IActionResult> CrearMysticBox([FromBody] MysticBoxDTO mysticBoxDTO)
        {
            try
            {
                var caja = await _mysticBoxLN.CrearMysticBox(mysticBoxDTO);
                return Ok(caja);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPut("{idCaja}")]
        public async Task<IActionResult> ActualizarMysticBox(int idCaja, [FromBody] MysticBoxDTO mysticBoxDTO)
        {
            try
            {
                var resultado = await _mysticBoxLN.ActualizarMysticBox(idCaja, mysticBoxDTO);
                return resultado ? Ok(new { mensaje = "Caja actualizada correctamente." }) : NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpDelete("{idCaja}")]
        public async Task<IActionResult> EliminarMysticBox(int idCaja)
        {
            var resultado = await _mysticBoxLN.EliminarMysticBox(idCaja);
            return resultado ? Ok(new { mensaje = "Caja eliminada correctamente." }) : NotFound();
        }
    }
}

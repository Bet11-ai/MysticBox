using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.InterfacesLN;
using MysticBox.Dominio.DTO;


namespace MysticBox.Api.Controllers

{
    [ApiController]
    [Route("api/cupones")]

    public class CuponesController : ControllerBase
    {
        private readonly ICuponLN _cuponLN;

        public CuponesController(ICuponLN cuponLN)
        {
            _cuponLN = cuponLN;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var cupones = await _cuponLN.ObtenerCupones();
            return Ok(cupones);
        }

        [HttpGet("{idCupon}")]
        public async Task<IActionResult> ObtenerCuponPorId(int idCupon)
        {
            var cupon = await _cuponLN.ObtenerCuponPorId(idCupon);

            if (cupon == null)
            {
                return NotFound();
            }
            return Ok(cupon);
        }
        [HttpPost]
        public async Task<IActionResult> CrearCupon([FromBody] CuponDTO cuponDTO)
        {
            var cupon = await _cuponLN.CrearCupon(cuponDTO);

            return Ok(cupon);
        }
        [HttpPut("{idCupon}")]
        public async Task<IActionResult> ActualizarCupon(int idCupon, [FromBody] CuponDTO cuponDTO)
        {
            var resultado = await _cuponLN.ActualizarCupon(idCupon, cuponDTO);

            if (!resultado)
                return NotFound();

            return Ok(resultado);
        }

        [HttpDelete("{idCupon}")]
        public async Task<IActionResult> EliminarCupon(int idCupon)
        {
            var resultado = await _cuponLN.EliminarCupon(idCupon);

            if (!resultado)
                return NotFound();

            return Ok(resultado);
        }
    }
}
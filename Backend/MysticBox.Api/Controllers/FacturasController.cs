using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.InterfacesLN;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;


namespace MysticBox.Api.Controllers

{
    [ApiController]
    [Route("api/facturas")]

    public class FacturasController : ControllerBase
    {
        private readonly IFacturaLN _facturaLN;

        public FacturasController(IFacturaLN facturaLN)
        {
            _facturaLN = facturaLN;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var facturas = await _facturaLN.ObtenerFacturas();
            return Ok(facturas);
        }

        [HttpGet("{idFactura}")]
        public async Task<IActionResult> ObtenerFacturaPorId(int idFactura)
        {
            var factura = await _facturaLN.ObtenerFacturaPorId(idFactura);

            if (factura == null)
            {
                return NotFound();
            }
            return Ok(factura);
        }
        [HttpPost]
        public async Task<IActionResult> CrearFactura([FromBody] FacturaDTO facturaDTO)
        {
            var factura = await _facturaLN.CrearFactura(facturaDTO);

            return Ok(factura);
        }
        [HttpPut("{idfactura}")]
        public async Task<IActionResult> ActualizarFactura(int idFactura, [FromBody] FacturaDTO facturaDTO)
        {
            var resultado = await _facturaLN.ActualizarFactura(idFactura, facturaDTO);

            if (!resultado)
                return NotFound();

            return Ok(resultado);
        }

        [HttpDelete("{idFactura}")]
        public async Task<IActionResult> EliminarFactura(int idFactura)
        {
            var resultado = await _facturaLN.EliminarFactura(idFactura);

            if (!resultado)
                return NotFound();

            return Ok(resultado);
        }
    }
}
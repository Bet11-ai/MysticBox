using Microsoft.AspNetCore.Mvc;
using MysticBox.Dominio.InterfacesLN;
using MysticBox.Dominio.DTO;


namespace MysticBox.Api.Controllers

{ 
    [ApiController]
    [Route("api/categorias")]

    public class CategoriasController : ControllerBase 
    {
        private readonly ICategoriaLN _categoriaLN;

        public CategoriasController(ICategoriaLN categoriaLN)
        {
            _categoriaLN = categoriaLN;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var categorias = await _categoriaLN.ObtenerCategorias();
            return Ok(categorias);
        }

        [HttpGet("{idCategoria}")]
        public async Task<IActionResult> ObtenerPorId(int idCategoria)
        {
            var categoria = await _categoriaLN.ObtenerCategoriaPorId(idCategoria);

            if (categoria == null)
            {
                return NotFound();
            }
            return Ok(categoria);
        }
        [HttpPost]
        public async Task<IActionResult> CrearCategoria([FromBody]CategoriaDTO categoriaDTO)
        {
            var categoria = await _categoriaLN.CrearCategoria(categoriaDTO);
        
            return Ok(categoria);
        }
        [HttpPut("{idCategoria}")]
        public async Task<IActionResult> ActualizarCategoria(int idCategoria, [FromBody] CategoriaDTO categoriaDTO)
        {
            var resultado = await _categoriaLN.ActualizarCategoria(idCategoria, categoriaDTO);

            if (!resultado)
                return NotFound();
        
            return Ok(resultado);
        }

        [HttpDelete("{idCategoria}")]
        public async Task<IActionResult> EliminarCategoria(int idCategoria)
            {
        var resultado = await _categoriaLN.EliminarCategoria(idCategoria);
            
            if(!resultado)
                return NotFound();

            return Ok(resultado);
        }
    }
}

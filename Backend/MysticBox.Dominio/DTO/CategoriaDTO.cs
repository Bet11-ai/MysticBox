using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MysticBox.Dominio.DTO
{
    public class CategoriaDTO
    {
        public required string NombreCategoria { get; set; }

        public string? Descripcion { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MysticBox.Dominio.DTO
{
    public class MysticBoxDTO
    {
        public int IdCategoria { get; set; }

        public string NombreCaja { get; set; } = null!;

        public string? Descripcion { get; set; }

        public decimal Precio { get; set; }

        public string? Imagen { get; set; }

        public int Stock { get; set; }

        public bool? Estado { get; set; }
    }
}

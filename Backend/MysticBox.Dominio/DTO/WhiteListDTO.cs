using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MysticBox.Dominio.DTO
{
    public class WhiteListDTO
    {
        public string Correo { get; set; } = null!;

        public bool? Activo { get; set; }

        public DateTime? FechaRegistro { get; set; }
    }
}

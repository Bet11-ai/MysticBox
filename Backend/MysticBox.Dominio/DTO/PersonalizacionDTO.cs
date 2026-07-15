using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MysticBox.Dominio.DTO
{
    public class PersonalizacionDTO
    {
        public int IdPersonalizacion { get; set; }

        public int IdUsuario { get; set; }

        public int IdCaja { get; set; }

        public string? TamanoCaja { get; set; }

        public string? Preferencias { get; set; }

        public string? Exclusiones { get; set; }

        public string? MensajePersonalizado { get; set; }

        public DateTime? FechaPersonalizacion { get; set; }
    }
}

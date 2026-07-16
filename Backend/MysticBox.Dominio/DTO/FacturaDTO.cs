using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MysticBox.Dominio.DTO
{
    public class FacturaDTO
    {
        public int IdPedido { get; set; }

        public string NumeroFactura { get; set; } = null!;

        public DateTime? FechaFactura { get; set; }

        public decimal Subtotal { get; set; }

        public decimal? Descuento { get; set; }

        public decimal Total { get; set; }
    }
}

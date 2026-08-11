using System;

namespace MysticBox.Dominio.DTO
{
    public class FacturaDTO
    {
        public int IdPedido { get; set; }

        public string? NumeroFactura { get; set; }

        public DateTime? FechaFactura { get; set; }

        public decimal Subtotal { get; set; }

        public decimal? Descuento { get; set; }

        public decimal CostoEnvio { get; set; }

        public decimal Total { get; set; }
    }
}
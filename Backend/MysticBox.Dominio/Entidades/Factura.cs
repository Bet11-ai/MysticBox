using System;
using System.Collections.Generic;

namespace MysticBox.Dominio.Entidades;

public partial class Factura
{
    public int IdFactura { get; set; }

    public int IdPedido { get; set; }

    public string NumeroFactura { get; set; } = null!;

    public DateTime? FechaFactura { get; set; }

    public decimal Subtotal { get; set; }

    public decimal? Descuento { get; set; }

    public decimal Total { get; set; }

    public virtual Pedido IdPedidoNavigation { get; set; } = null!;
}

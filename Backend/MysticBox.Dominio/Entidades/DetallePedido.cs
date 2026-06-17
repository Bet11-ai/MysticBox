using MysticBox.Dominio.Entidades;
using System;
using System.Collections.Generic;

namespace MysticBox.Dominio.Entidades;

public partial class DetallePedido
{
    public int IdDetallePedido { get; set; }

    public int IdPedido { get; set; }

    public int IdCaja { get; set; }

    public int? IdPersonalizacion { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public decimal? Subtotal { get; set; }

    public virtual MysticBox IdCajaNavigation { get; set; } = null!;

    public virtual Pedido IdPedidoNavigation { get; set; } = null!;

    public virtual Personalizacione? IdPersonalizacionNavigation { get; set; }
}

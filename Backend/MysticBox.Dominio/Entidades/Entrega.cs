using System;
using System.Collections.Generic;

namespace MysticBox.Dominio.Entidades;

public partial class Entrega
{
    public int IdEntrega { get; set; }

    public int IdPedido { get; set; }

    public string DireccionEntrega { get; set; } = null!;

    public string? EstadoEntrega { get; set; }

    public DateOnly? FechaEstimada { get; set; }

    public DateOnly? FechaEntrega { get; set; }

    public string? UbicacionReferencia { get; set; }

    public virtual Pedido IdPedidoNavigation { get; set; } = null!;
}

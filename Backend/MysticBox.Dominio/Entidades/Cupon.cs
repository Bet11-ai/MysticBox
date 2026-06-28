using System;
using System.Collections.Generic;

namespace MysticBox.Dominio.Entidades;

public partial class Cupon
{
    public int IdCupon { get; set; }

    public string Codigo { get; set; } = null!;

    public string? Descripcion { get; set; }

    public decimal? PorcentajeDescuento { get; set; }

    public decimal? MontoDescuento { get; set; }

    public DateOnly FechaInicio { get; set; }

    public DateOnly FechaFin { get; set; }

    public bool? Activo { get; set; }

    public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
}

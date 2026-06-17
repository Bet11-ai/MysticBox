using MysticBox.Dominio.Entidades;
using System;
using System.Collections.Generic;

namespace MysticBox.Dominio.Entidades;

public partial class Calificacione
{
    public int IdCalificacion { get; set; }

    public int IdPedido { get; set; }

    public int Estrellas { get; set; }

    public string? Comentario { get; set; }

    public DateTime? FechaCalificacion { get; set; }

    public virtual Pedido IdPedidoNavigation { get; set; } = null!;
}

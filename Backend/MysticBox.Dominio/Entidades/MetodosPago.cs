using System;
using System.Collections.Generic;

namespace MysticBox.Dominio.Entidades;

public partial class MetodosPago
{
    public int IdMetodoPago { get; set; }

    public string NombreMetodo { get; set; } = null!;

    public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
}

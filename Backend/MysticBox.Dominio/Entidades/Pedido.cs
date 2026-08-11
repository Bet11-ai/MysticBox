using System;
using System.Collections.Generic;

namespace MysticBox.Dominio.Entidades;

public partial class Pedido
{
    public int IdPedido { get; set; }

    public int IdUsuario { get; set; }

    public int? IdCupon { get; set; }

    public int IdMetodoPago { get; set; }

    public DateTime? FechaPedido { get; set; }

    public decimal Subtotal { get; set; }

    public decimal? Descuento { get; set; }

    public decimal CostoEnvio { get; set; }

    public decimal Total { get; set; }

    public string? EstadoPedido { get; set; }

    public virtual ICollection<Calificacione> Calificaciones { get; set; } = new List<Calificacione>();

    public string? TipoEntrega { get; set; }

    public string? DireccionEntrega { get; set; }

    public string? ProvinciaEntrega { get; set; }

    public virtual ICollection<DetallePedido> DetallePedidos { get; set; } = new List<DetallePedido>();

    public virtual ICollection<Entrega> Entregas { get; set; } = new List<Entrega>();

    public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();

    public virtual Cupon? IdCuponNavigation { get; set; }

    public virtual MetodosPago IdMetodoPagoNavigation { get; set; } = null!;

    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;
}
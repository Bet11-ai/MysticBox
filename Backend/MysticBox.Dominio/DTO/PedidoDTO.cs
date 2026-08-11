namespace MysticBox.Dominio.DTO;

public class PedidoDTO
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

    public string? TipoEntrega { get; set; }

    public string? DireccionEntrega { get; set; }

    public string? ProvinciaEntrega { get; set; }
}
namespace MysticBox.Dominio.DTO;

public class PedidoDetalleCompletoDTO
{
    public int IdPedido { get; set; }

    public string NumeroPedido { get; set; } = string.Empty;

    public DateTime? FechaPedido { get; set; }

    public string EstadoPedido { get; set; } = string.Empty;

    public decimal Subtotal { get; set; }

    public decimal Descuento { get; set; }

    public decimal Total { get; set; }

    public ClientePedidoDTO Cliente { get; set; } =
        new ClientePedidoDTO();

    public MetodoPagoPedidoDTO MetodoPago { get; set; } =
        new MetodoPagoPedidoDTO();

    public CuponPedidoDTO? Cupon { get; set; }

    public List<ProductoPedidoDTO> Productos { get; set; } =
        new List<ProductoPedidoDTO>();
}

public class ClientePedidoDTO
{
    public int IdUsuario { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Correo { get; set; } = string.Empty;

    public string? Telefono { get; set; }

    public string? Direccion { get; set; }
}

public class MetodoPagoPedidoDTO
{
    public int IdMetodoPago { get; set; }

    public string NombreMetodo { get; set; } = string.Empty;
}

public class CuponPedidoDTO
{
    public int IdCupon { get; set; }

    public string Codigo { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public decimal? PorcentajeDescuento { get; set; }

    public decimal? MontoDescuento { get; set; }
}

public class ProductoPedidoDTO
{
    public int IdDetallePedido { get; set; }

    public int IdCaja { get; set; }

    public string NombreCaja { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public string? Imagen { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public decimal Subtotal { get; set; }

    public int? IdPersonalizacion { get; set; }

    public string? TamanoCaja { get; set; }

    public string? Preferencias { get; set; }

    public string? Exclusiones { get; set; }

    public string? MensajePersonalizado { get; set; }
}
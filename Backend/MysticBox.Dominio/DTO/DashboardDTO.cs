namespace MysticBox.Dominio.DTO;

public class DashboardDTO
{
    public int TotalClientes { get; set; }

    public int ClientesActivos { get; set; }

    public int ClientesInactivos { get; set; }

    public int TotalPedidos { get; set; }

    public int PedidosPendientes { get; set; }

    public int PedidosPreparando { get; set; }

    public int PedidosEmpacando { get; set; }

    public int PedidosEnCamino { get; set; }

    public int PedidosEntregados { get; set; }

    public int PedidosCancelados { get; set; }

    public decimal VentasTotales { get; set; }

    public decimal PromedioPorPedido { get; set; }

    public int TotalCajas { get; set; }

    public int CuponesActivos { get; set; }

    public List<DashboardPedidoDTO>
        UltimosPedidos
    { get; set; } =
            new List<DashboardPedidoDTO>();
}

public class DashboardPedidoDTO
{
    public int IdPedido { get; set; }

    public string NumeroPedido { get; set; } =
        string.Empty;

    public string Cliente { get; set; } =
        string.Empty;

    public DateTime? FechaPedido { get; set; }

    public decimal Total { get; set; }

    public string EstadoPedido { get; set; } =
        string.Empty;
}
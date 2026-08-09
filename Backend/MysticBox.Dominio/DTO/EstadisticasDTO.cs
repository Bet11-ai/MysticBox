namespace MysticBox.Dominio.DTO;

public class EstadisticasDTO
{
    public int Anio { get; set; }

    public int TotalPedidos { get; set; }

    public decimal VentasTotales { get; set; }

    public decimal PromedioVenta { get; set; }

    public decimal DescuentosAplicados { get; set; }

    public int TotalClientesConPedidos { get; set; }

    public string MesMayorVenta { get; set; } =
        string.Empty;

    public decimal MayorVentaMensual { get; set; }

    public List<VentaMensualDTO>
        VentasPorMes
    { get; set; } =
            new();

    public List<PedidosEstadoDTO>
        PedidosPorEstado
    { get; set; } =
            new();

    public List<ClienteEstadisticaDTO>
        MejoresClientes
    { get; set; } =
            new();
}

public class VentaMensualDTO
{
    public int NumeroMes { get; set; }

    public string Mes { get; set; } =
        string.Empty;

    public int CantidadPedidos { get; set; }

    public decimal Ventas { get; set; }
}

public class PedidosEstadoDTO
{
    public string Estado { get; set; } =
        string.Empty;

    public int Cantidad { get; set; }

    public decimal Porcentaje { get; set; }
}

public class ClienteEstadisticaDTO
{
    public int IdUsuario { get; set; }

    public string Nombre { get; set; } =
        string.Empty;

    public int CantidadPedidos { get; set; }

    public decimal TotalComprado { get; set; }
}
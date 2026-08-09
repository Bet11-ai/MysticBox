using System.Globalization;
using System.Text;

using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class EstadisticasLN :
    IEstadisticasLN
{
    private readonly IUnidadTrabajoEF
        _unidadTrabajo;

    public EstadisticasLN(
        IUnidadTrabajoEF unidadTrabajo
    )
    {
        _unidadTrabajo =
            unidadTrabajo;
    }

    public async Task<EstadisticasDTO>
        ObtenerEstadisticas(
            int? anio = null
        )
    {
        var anioSeleccionado =
            anio ?? DateTime.Now.Year;

        var respuestaPedidos =
            _unidadTrabajo
                .TPedido
                .Listar();

        var respuestaUsuarios =
            _unidadTrabajo
                .TUsuario
                .Listar();

        var pedidos =
            respuestaPedidos
                .ValorRetorno
                ?.ToList() ??
            new List<Pedido>();

        var usuarios =
            respuestaUsuarios
                .ValorRetorno
                ?.ToList() ??
            new List<Usuario>();

        /*
         * Solo trabajamos con pedidos
         * pertenecientes al año indicado.
         */
        var pedidosAnio =
            pedidos
                .Where(
                    pedido =>
                        pedido.FechaPedido
                            .HasValue &&
                        pedido.FechaPedido
                            .Value
                            .Year ==
                        anioSeleccionado
                )
                .ToList();

        /*
         * No contamos pedidos cancelados
         * como ventas.
         */
        var pedidosVenta =
            pedidosAnio
                .Where(
                    pedido =>
                        NormalizarEstado(
                            pedido.EstadoPedido
                        ) !=
                        "cancelado"
                )
                .ToList();

        var estadisticas =
            new EstadisticasDTO
            {
                Anio =
                    anioSeleccionado,

                TotalPedidos =
                    pedidosAnio.Count,

                VentasTotales =
                    pedidosVenta.Sum(
                        pedido =>
                            pedido.Total
                    ),

                DescuentosAplicados =
                    pedidosVenta.Sum(
                        pedido =>
                            pedido.Descuento ??
                            0
                    ),

                TotalClientesConPedidos =
                    pedidosAnio
                        .Select(
                            pedido =>
                                pedido.IdUsuario
                        )
                        .Distinct()
                        .Count()
            };

        estadisticas.PromedioVenta =
            pedidosVenta.Count > 0
                ? estadisticas
                    .VentasTotales /
                  pedidosVenta.Count
                : 0;

        estadisticas.VentasPorMes =
            ConstruirVentasPorMes(
                pedidosVenta,
                anioSeleccionado
            );

        var mejorMes =
            estadisticas
                .VentasPorMes
                .OrderByDescending(
                    mes =>
                        mes.Ventas
                )
                .FirstOrDefault();

        if (mejorMes != null)
        {
            estadisticas.MesMayorVenta =
                mejorMes.Mes;

            estadisticas.MayorVentaMensual =
                mejorMes.Ventas;
        }

        estadisticas.PedidosPorEstado =
            ConstruirPedidosPorEstado(
                pedidosAnio
            );

        estadisticas.MejoresClientes =
            ConstruirMejoresClientes(
                pedidosVenta,
                usuarios
            );

        return await Task.FromResult(
            estadisticas
        );
    }

    private static List<VentaMensualDTO>
        ConstruirVentasPorMes(
            List<Pedido> pedidos,
            int anio
        )
    {
        var cultura =
            new CultureInfo(
                "es-CR"
            );

        var resultado =
            new List<VentaMensualDTO>();

        for (
            var numeroMes = 1;
            numeroMes <= 12;
            numeroMes++
        )
        {
            var pedidosMes =
                pedidos
                    .Where(
                        pedido =>
                            pedido.FechaPedido
                                .HasValue &&
                            pedido.FechaPedido
                                .Value.Year ==
                            anio &&
                            pedido.FechaPedido
                                .Value.Month ==
                            numeroMes
                    )
                    .ToList();

            var nombreMes =
                cultura
                    .DateTimeFormat
                    .GetMonthName(
                        numeroMes
                    );

            if (
                !string.IsNullOrWhiteSpace(
                    nombreMes
                )
            )
            {
                nombreMes =
                    char.ToUpper(
                        nombreMes[0]
                    ) +
                    nombreMes[1..];
            }

            resultado.Add(
                new VentaMensualDTO
                {
                    NumeroMes =
                        numeroMes,

                    Mes =
                        nombreMes,

                    CantidadPedidos =
                        pedidosMes.Count,

                    Ventas =
                        pedidosMes.Sum(
                            pedido =>
                                pedido.Total
                        )
                }
            );
        }

        return resultado;
    }

    private static List<PedidosEstadoDTO>
        ConstruirPedidosPorEstado(
            List<Pedido> pedidos
        )
    {
        var estados =
            new[]
            {
                "Pendiente",
                "Preparando",
                "Empacando",
                "En camino",
                "Entregado",
                "Cancelado"
            };

        var total =
            pedidos.Count;

        return estados
            .Select(
                estado =>
                {
                    var cantidad =
                        pedidos.Count(
                            pedido =>
                                NormalizarEstado(
                                    pedido
                                        .EstadoPedido
                                ) ==
                                NormalizarEstado(
                                    estado
                                )
                        );
                    var porcentaje =
    total > 0
        ? Math.Round(
            ((decimal)cantidad / total) * 100,
            2
        )
        : 0;

                    return new
                        PedidosEstadoDTO
                    {
                        Estado =
                            estado,

                        Cantidad =
                            cantidad,

                        Porcentaje =
                            porcentaje
                    };
                }
            )
            .ToList();
    }

    private static
        List<ClienteEstadisticaDTO>
        ConstruirMejoresClientes(
            List<Pedido> pedidos,
            List<Usuario> usuarios
        )
    {
        return pedidos
            .GroupBy(
                pedido =>
                    pedido.IdUsuario
            )
            .Select(
                grupo =>
                {
                    var usuario =
                        usuarios
                            .FirstOrDefault(
                                item =>
                                    item.IdUsuario ==
                                    grupo.Key
                            );

                    return new
                        ClienteEstadisticaDTO
                    {
                        IdUsuario =
                            grupo.Key,

                        Nombre =
                            usuario?.Nombre ??
                            $"Cliente #{grupo.Key}",

                        CantidadPedidos =
                            grupo.Count(),

                        TotalComprado =
                            grupo.Sum(
                                pedido =>
                                    pedido.Total
                            )
                    };
                }
            )
            .OrderByDescending(
                cliente =>
                    cliente.TotalComprado
            )
            .Take(5)
            .ToList();
    }

    private static string
        NormalizarEstado(
            string? estado
        )
    {
        var texto =
            (
                estado ??
                string.Empty
            )
            .Trim()
            .ToLower();

        var normalizado =
            texto.Normalize(
                NormalizationForm.FormD
            );

        var caracteres =
            normalizado.Where(
                caracter =>
                    CharUnicodeInfo
                        .GetUnicodeCategory(
                            caracter
                        ) !=
                    UnicodeCategory
                        .NonSpacingMark
            );

        return new string(
            caracteres.ToArray()
        );
    }
}
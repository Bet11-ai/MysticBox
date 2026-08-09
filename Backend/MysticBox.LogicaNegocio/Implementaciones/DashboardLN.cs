using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class DashboardLN : IDashboardLN
{
    private const int RolCliente = 2;

    private readonly IUnidadTrabajoEF
        _unidadTrabajo;

    public DashboardLN(
        IUnidadTrabajoEF unidadTrabajo
    )
    {
        _unidadTrabajo =
            unidadTrabajo;
    }

    public async Task<DashboardDTO>
        ObtenerDashboard()
    {
        var usuariosRespuesta =
            _unidadTrabajo
                .TUsuario
                .Listar();

        var pedidosRespuesta =
            _unidadTrabajo
                .TPedido
                .Listar();

        var cajasRespuesta =
            _unidadTrabajo
                .TMysticBox
                .Listar();

        var cuponesRespuesta =
            _unidadTrabajo
                .TCupon
                .Listar();

        var usuarios =
            usuariosRespuesta
                .ValorRetorno
                ?.ToList() ??
            new List<Usuario>();

        var pedidos =
            pedidosRespuesta
                .ValorRetorno
                ?.ToList() ??
            new List<Pedido>();

        var cajas =
            cajasRespuesta
                .ValorRetorno
                ?.ToList() ??
            new List<
                MysticBox.Dominio
                    .Entidades
                    .MysticBox
            >();

        var cupones =
            cuponesRespuesta
                .ValorRetorno
                ?.ToList() ??
            new List<Cupon>();

        var clientes =
            usuarios
                .Where(
                    usuario =>
                        usuario.IdRol ==
                        RolCliente
                )
                .ToList();

        var dashboard =
            new DashboardDTO
            {
                TotalClientes =
                    clientes.Count,

                ClientesActivos =
                    clientes.Count(
                        usuario =>
                            usuario.Estado ==
                            true
                    ),

                ClientesInactivos =
                    clientes.Count(
                        usuario =>
                            usuario.Estado !=
                            true
                    ),

                TotalPedidos =
                    pedidos.Count,

                PedidosPendientes =
                    ContarEstado(
                        pedidos,
                        "Pendiente"
                    ),

                PedidosPreparando =
                    ContarEstado(
                        pedidos,
                        "Preparando"
                    ),

                PedidosEmpacando =
                    ContarEstado(
                        pedidos,
                        "Empacando"
                    ),

                PedidosEnCamino =
                    ContarEstado(
                        pedidos,
                        "En camino"
                    ),

                PedidosEntregados =
                    ContarEstado(
                        pedidos,
                        "Entregado"
                    ),

                PedidosCancelados =
                    ContarEstado(
                        pedidos,
                        "Cancelado"
                    ),

                VentasTotales =
                    pedidos
                        .Where(
                            pedido =>
                                NormalizarEstado(
                                    pedido
                                        .EstadoPedido
                                ) !=
                                "cancelado"
                        )
                        .Sum(
                            pedido =>
                                pedido.Total
                        ),

                TotalCajas =
                    cajas.Count,

                CuponesActivos =
    cupones.Count(
        cupon =>
            cupon.Activo == true
    )
            };

        dashboard.PromedioPorPedido =
            dashboard.TotalPedidos > 0
                ? dashboard.VentasTotales /
                  dashboard.TotalPedidos
                : 0;

        dashboard.UltimosPedidos =
            pedidos
                .OrderByDescending(
                    pedido =>
                        pedido.FechaPedido
                )
                .ThenByDescending(
                    pedido =>
                        pedido.IdPedido
                )
                .Take(5)
                .Select(
                    pedido =>
                    {
                        var cliente =
                            usuarios
                                .FirstOrDefault(
                                    usuario =>
                                        usuario.IdUsuario ==
                                        pedido.IdUsuario
                                );

                        return new
                            DashboardPedidoDTO
                        {
                            IdPedido =
                                pedido.IdPedido,

                            NumeroPedido =
                                $"MB-{pedido.IdPedido:D6}",

                            Cliente =
                                cliente?.Nombre ??
                                $"Usuario #{pedido.IdUsuario}",

                            FechaPedido =
                                pedido.FechaPedido,

                            Total =
                                pedido.Total,

                            EstadoPedido =
                                pedido.EstadoPedido ??
                                "Pendiente"
                        };
                    }
                )
                .ToList();

        return await Task.FromResult(
            dashboard
        );
    }

    private static int ContarEstado(
        List<Pedido> pedidos,
        string estado
    )
    {
        var estadoNormalizado =
            NormalizarEstado(
                estado
            );

        return pedidos.Count(
            pedido =>
                NormalizarEstado(
                    pedido.EstadoPedido
                ) ==
                estadoNormalizado
        );
    }

    private static string
        NormalizarEstado(
            string? estado
        )
    {
        return (
            estado ??
            string.Empty
        )
        .Trim()
        .ToLower()
        .Normalize(
            System.Text
                .NormalizationForm
                .FormD
        )
        .Where(
            caracter =>
                System.Globalization
                    .CharUnicodeInfo
                    .GetUnicodeCategory(
                        caracter
                    ) !=
                System.Globalization
                    .UnicodeCategory
                    .NonSpacingMark
        )
        .Aggregate(
            string.Empty,
            (
                texto,
                caracter
            ) =>
                texto + caracter
        );
    }
}
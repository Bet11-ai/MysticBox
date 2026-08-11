using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class PedidoLN : IPedidoLN
{
    private readonly IUnidadTrabajoEF _unidadTrabajo;

    public PedidoLN(
        IUnidadTrabajoEF unidadTrabajo
    )
    {
        _unidadTrabajo = unidadTrabajo;
    }

    public async Task<List<Pedido>>
        ObtenerPedidos()
    {
        var respuesta =
            _unidadTrabajo
                .TPedido
                .Listar();

        return await Task.FromResult(
            respuesta
                .ValorRetorno?
                .ToList() ??
            new List<Pedido>()
        );
    }

    public async Task<Pedido?>
        ObtenerPedidoPorId(
            int idPedido
        )
    {
        var respuesta =
            _unidadTrabajo
                .TPedido
                .ObtenerEntidad(
                    pedido =>
                        pedido.IdPedido ==
                        idPedido
                );

        return await Task.FromResult(
            respuesta.ValorRetorno
        );
    }

    public async Task<
        PedidoDetalleCompletoDTO?
    > ObtenerDetalleCompleto(
        int idPedido
    )
    {
        var includes = new List<string>
        {
            "IdUsuarioNavigation",
            "IdMetodoPagoNavigation",
            "IdCuponNavigation",
            "DetallePedidos",
            "DetallePedidos.IdCajaNavigation",
            "DetallePedidos.IdPersonalizacionNavigation"
        };

        var respuesta =
            _unidadTrabajo
                .TPedido
                .ObtenerEntidad(
                    pedido =>
                        pedido.IdPedido ==
                        idPedido,
                    includes
                );

        var pedido =
            respuesta.ValorRetorno;

        if (pedido == null)
        {
            return await Task.FromResult<
                PedidoDetalleCompletoDTO?
            >(null);
        }

        var detalle =
            new PedidoDetalleCompletoDTO
            {
                IdPedido =
                    pedido.IdPedido,

                NumeroPedido =
                    $"MB-{pedido.IdPedido:D6}",

                FechaPedido =
                    pedido.FechaPedido,

                EstadoPedido =
                    pedido.EstadoPedido ??
                    "Pendiente",

                Subtotal =
                    pedido.Subtotal,

                Descuento =
                    pedido.Descuento ?? 0,
                

                CostoEnvio =
    pedido.CostoEnvio,
                Total =
                    pedido.Total,

                TipoEntrega =
    pedido.TipoEntrega,

                DireccionEntrega =
    pedido.DireccionEntrega,

                ProvinciaEntrega =
    pedido.ProvinciaEntrega,

               

                Cliente =
                    new ClientePedidoDTO
                    {
                        IdUsuario =
                            pedido.IdUsuario,

                        Nombre =
                            pedido
                                .IdUsuarioNavigation
                                ?.Nombre ??
                            $"Usuario #{pedido.IdUsuario}",

                        Correo =
                            pedido
                                .IdUsuarioNavigation
                                ?.Correo ??
                            string.Empty,

                        Telefono =
                            pedido
                                .IdUsuarioNavigation
                                ?.Telefono,

                        Direccion =
                            pedido
                                .IdUsuarioNavigation
                                ?.Direccion
                    },

                MetodoPago =
                    new MetodoPagoPedidoDTO
                    {
                        IdMetodoPago =
                            pedido.IdMetodoPago,

                        NombreMetodo =
                            pedido
                                .IdMetodoPagoNavigation
                                ?.NombreMetodo ??
                            $"Método #{pedido.IdMetodoPago}"
                    },

                Cupon =
                    pedido.IdCuponNavigation ==
                    null
                        ? null
                        : new CuponPedidoDTO
                        {
                            IdCupon =
                                pedido
                                    .IdCuponNavigation
                                    .IdCupon,

                            Codigo =
                                pedido
                                    .IdCuponNavigation
                                    .Codigo,

                            Descripcion =
                                pedido
                                    .IdCuponNavigation
                                    .Descripcion,

                            PorcentajeDescuento =
                                pedido
                                    .IdCuponNavigation
                                    .PorcentajeDescuento,

                            MontoDescuento =
                                pedido
                                    .IdCuponNavigation
                                    .MontoDescuento
                        },

                Productos =
                    pedido
                        .DetallePedidos
                        .Select(
                            detallePedido =>
                                new ProductoPedidoDTO
                                {
                                    IdDetallePedido =
                                        detallePedido
                                            .IdDetallePedido,

                                    IdCaja =
                                        detallePedido
                                            .IdCaja,

                                    NombreCaja =
                                        detallePedido
                                            .IdCajaNavigation
                                            ?.NombreCaja ??
                                        $"Caja #{detallePedido.IdCaja}",

                                    Descripcion =
                                        detallePedido
                                            .IdCajaNavigation
                                            ?.Descripcion,

                                    Imagen =
                                        detallePedido
                                            .IdCajaNavigation
                                            ?.Imagen,

                                    Cantidad =
                                        detallePedido
                                            .Cantidad,

                                    PrecioUnitario =
                                        detallePedido
                                            .PrecioUnitario,

                                    Subtotal =
                                        detallePedido
                                            .Subtotal ??
                                        (
                                            detallePedido
                                                .Cantidad *
                                            detallePedido
                                                .PrecioUnitario
                                        ),

                                    IdPersonalizacion =
                                        detallePedido
                                            .IdPersonalizacion,

                                    TamanoCaja =
                                        detallePedido
                                            .IdPersonalizacionNavigation
                                            ?.TamanoCaja,

                                    Preferencias =
                                        detallePedido
                                            .IdPersonalizacionNavigation
                                            ?.Preferencias,

                                    Exclusiones =
                                        detallePedido
                                            .IdPersonalizacionNavigation
                                            ?.Exclusiones,

                                    MensajePersonalizado =
                                        detallePedido
                                            .IdPersonalizacionNavigation
                                            ?.MensajePersonalizado
                                }
                        )
                        .ToList()
            };

        return await Task.FromResult(
            detalle
        );
    }

    public async Task<Pedido>
        CrearPedido(
            PedidoDTO pedidoDTO
        )
    {
        var pedido =
            new Pedido
            {
                IdUsuario =
                    pedidoDTO.IdUsuario,

                IdCupon =
                    pedidoDTO.IdCupon,

                IdMetodoPago =
                    pedidoDTO.IdMetodoPago,

                FechaPedido =
                    pedidoDTO.FechaPedido ??
                    DateTime.Now,

                Subtotal =
                    pedidoDTO.Subtotal,

                Descuento =
                    pedidoDTO.Descuento,

                CostoEnvio =
                    pedidoDTO.CostoEnvio,

                Total =
                    pedidoDTO.Total,

                EstadoPedido =
                    pedidoDTO.EstadoPedido ??
                    "Pendiente",

                TipoEntrega =
                    pedidoDTO.TipoEntrega,

                DireccionEntrega =
                    pedidoDTO.DireccionEntrega,

                ProvinciaEntrega =
                    pedidoDTO.ProvinciaEntrega
            };

        _unidadTrabajo
            .TPedido
            .Insertar(pedido);

        _unidadTrabajo.Completar();

        return await Task.FromResult(
            pedido
        );
    }

    public async Task<bool>
        ActualizarPedido(
            int idPedido,
            PedidoDTO pedidoDTO
        )
    {
        var respuesta =
            _unidadTrabajo
                .TPedido
                .ObtenerEntidad(
                    pedido =>
                        pedido.IdPedido ==
                        idPedido
                );

        if (
            respuesta.ValorRetorno ==
            null
        )
        {
            return await Task.FromResult(
                false
            );
        }

        var pedido =
            respuesta.ValorRetorno;

        pedido.IdUsuario =
            pedidoDTO.IdUsuario;

        pedido.IdCupon =
            pedidoDTO.IdCupon;

        pedido.IdMetodoPago =
            pedidoDTO.IdMetodoPago;

        pedido.FechaPedido =
            pedidoDTO.FechaPedido;

        pedido.Subtotal =
            pedidoDTO.Subtotal;

        pedido.Descuento =
            pedidoDTO.Descuento;
        pedido.CostoEnvio =
    pedidoDTO.CostoEnvio;

        pedido.TipoEntrega =
            pedidoDTO.TipoEntrega;

        pedido.DireccionEntrega =
            pedidoDTO.DireccionEntrega;

        pedido.ProvinciaEntrega =
            pedidoDTO.ProvinciaEntrega;

        pedido.Total =
            pedidoDTO.Total;

        pedido.EstadoPedido =
            pedidoDTO.EstadoPedido;

        _unidadTrabajo
            .TPedido
            .Modificar(pedido);

        _unidadTrabajo.Completar();

        return await Task.FromResult(
            true
        );
    }

    public async Task<bool>
        EliminarPedido(
            int idPedido
        )
    {
        var respuesta =
            _unidadTrabajo
                .TPedido
                .ObtenerEntidad(
                    pedido =>
                        pedido.IdPedido ==
                        idPedido
                );

        if (
            respuesta.ValorRetorno ==
            null
        )
        {
            return await Task.FromResult(
                false
            );
        }

        _unidadTrabajo
            .TPedido
            .Eliminar(
                respuesta.ValorRetorno
            );

        _unidadTrabajo.Completar();

        return await Task.FromResult(
            true
        );
    }
}
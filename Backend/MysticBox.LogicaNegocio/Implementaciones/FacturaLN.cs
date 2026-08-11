using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MysticBox.LogicaNegocio.Implementaciones
{
    public class FacturaLN : IFacturaLN
    {
        private readonly IUnidadTrabajoEF _unidadTrabajo;

        public FacturaLN(
            IUnidadTrabajoEF unidadTrabajo
        )
        {
            _unidadTrabajo = unidadTrabajo;
        }

        public async Task<List<Factura>> ObtenerFacturas()
        {
            var respuesta =
                _unidadTrabajo
                    .TFactura
                    .Listar();

            return await Task.FromResult(
                respuesta
                    .ValorRetorno?
                    .ToList()
                ??
                new List<Factura>()
            );
        }

        public async Task<Factura?> ObtenerFacturaPorId(
            int idFactura
        )
        {
            var respuesta =
                _unidadTrabajo
                    .TFactura
                    .ObtenerEntidad(
                        x =>
                            x.IdFactura ==
                            idFactura
                    );

            return await Task.FromResult(
                respuesta.ValorRetorno
            );
        }

        public async Task<Factura> CrearFactura(
            FacturaDTO facturaDTO
        )
        {
            var factura =
                new Factura
                {
                    IdPedido =
                        facturaDTO.IdPedido,

                    NumeroFactura =
                        $"FAC-{facturaDTO.IdPedido:D6}",

                    FechaFactura =
                        facturaDTO.FechaFactura
                        ??
                        DateTime.Now,

                    Subtotal =
                        facturaDTO.Subtotal,

                    Descuento =
                        facturaDTO.Descuento,

                    CostoEnvio =
                        facturaDTO.CostoEnvio,

                    Total =
                        facturaDTO.Total
                };

            _unidadTrabajo
                .TFactura
                .Insertar(
                    factura
                );

            _unidadTrabajo
                .Completar();

            return await Task.FromResult(
                factura
            );
        }

        public async Task<bool> ActualizarFactura(
            int idFactura,
            FacturaDTO facturaDTO
        )
        {
            var respuesta =
                _unidadTrabajo
                    .TFactura
                    .ObtenerEntidad(
                        x =>
                            x.IdFactura ==
                            idFactura
                    );

            if (
                respuesta.ValorRetorno ==
                null
            )
            {
                return false;
            }

            var factura =
                respuesta.ValorRetorno;

            factura.IdPedido =
                facturaDTO.IdPedido;

            factura.NumeroFactura =
                string.IsNullOrWhiteSpace(
                    facturaDTO.NumeroFactura
                )
                ?
                factura.NumeroFactura
                :
                facturaDTO.NumeroFactura;

            factura.FechaFactura =
                facturaDTO.FechaFactura;

            factura.Subtotal =
                facturaDTO.Subtotal;

            factura.Descuento =
                facturaDTO.Descuento;

            factura.CostoEnvio =
                facturaDTO.CostoEnvio;

            factura.Total =
                facturaDTO.Total;

            _unidadTrabajo
                .TFactura
                .Modificar(
                    factura
                );

            _unidadTrabajo
                .Completar();

            return true;
        }

        public async Task<bool> EliminarFactura(
            int idFactura
        )
        {
            var respuesta =
                _unidadTrabajo
                    .TFactura
                    .ObtenerEntidad(
                        x =>
                            x.IdFactura ==
                            idFactura
                    );

            if (
                respuesta.ValorRetorno ==
                null
            )
            {
                return false;
            }

            var factura =
                respuesta.ValorRetorno;

            _unidadTrabajo
                .TFactura
                .Eliminar(
                    factura
                );

            _unidadTrabajo
                .Completar();

            return true;
        }
    }
}
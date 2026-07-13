using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones
{
    public class CuponLN : ICuponLN
    {
        private readonly IUnidadTrabajoEF _unidadTrabajo;

        public CuponLN(IUnidadTrabajoEF unidadTrabajo)
        {
            _unidadTrabajo = unidadTrabajo;
        }

        public async Task<List<Cupon>> ObtenerCupones()
        {
            var respuesta = _unidadTrabajo.TCupon.Listar();

            return await Task.FromResult(
                respuesta.ValorRetorno?.ToList() ?? new List<Cupon>()
            );
        }

        public async Task<Cupon?> ObtenerCuponPorId(int idCupon)
        {
            var respuesta = _unidadTrabajo.TCupon.ObtenerEntidad(
                x => x.IdCupon == idCupon
            );

            return await Task.FromResult(respuesta.ValorRetorno);
        }

        public async Task<Cupon?> ObtenerCuponPorCodigo(string codigo)
        {
            if (string.IsNullOrWhiteSpace(codigo))
            {
                return null;
            }

            var codigoNormalizado = codigo.Trim().ToUpper();

            var respuesta = _unidadTrabajo.TCupon.ObtenerEntidad(
                x => x.Codigo.ToUpper() == codigoNormalizado
            );

            return await Task.FromResult(respuesta.ValorRetorno);
        }

        public async Task<Cupon> CrearCupon(CuponDTO cuponDTO)
        {
            var cupon = new Cupon
            {
                Codigo = cuponDTO.Codigo.Trim().ToUpper(),
                Descripcion = cuponDTO.Descripcion,
                PorcentajeDescuento = cuponDTO.PorcentajeDescuento,
                MontoDescuento = cuponDTO.MontoDescuento,
                FechaInicio = cuponDTO.FechaInicio,
                FechaFin = cuponDTO.FechaFin,
                Activo = cuponDTO.Activo
            };

            _unidadTrabajo.TCupon.Insertar(cupon);
            _unidadTrabajo.Completar();

            return await Task.FromResult(cupon);
        }

        public async Task<bool> ActualizarCupon(
            int idCupon,
            CuponDTO cuponDTO
        )
        {
            var respuesta = _unidadTrabajo.TCupon.ObtenerEntidad(
                x => x.IdCupon == idCupon
            );

            if (respuesta.ValorRetorno == null)
            {
                return await Task.FromResult(false);
            }

            var cupon = respuesta.ValorRetorno;

            cupon.Codigo = cuponDTO.Codigo.Trim().ToUpper();
            cupon.Descripcion = cuponDTO.Descripcion;
            cupon.PorcentajeDescuento = cuponDTO.PorcentajeDescuento;
            cupon.MontoDescuento = cuponDTO.MontoDescuento;
            cupon.FechaInicio = cuponDTO.FechaInicio;
            cupon.FechaFin = cuponDTO.FechaFin;
            cupon.Activo = cuponDTO.Activo;

            _unidadTrabajo.TCupon.Modificar(cupon);
            _unidadTrabajo.Completar();

            return await Task.FromResult(true);
        }

        public async Task<bool> EliminarCupon(int idCupon)
        {
            var respuesta = _unidadTrabajo.TCupon.ObtenerEntidad(
                x => x.IdCupon == idCupon
            );

            if (respuesta.ValorRetorno == null)
            {
                return await Task.FromResult(false);
            }

            var cupon = respuesta.ValorRetorno;

            _unidadTrabajo.TCupon.Eliminar(cupon);
            _unidadTrabajo.Completar();

            return await Task.FromResult(true);
        }
    }
}
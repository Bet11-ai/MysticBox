using MysticBox.Dominio.DTO;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones
{
    public class MysticBoxLN : IMysticBoxLN
    {
        private readonly IUnidadTrabajoEF _unidadTrabajo;

        public MysticBoxLN(IUnidadTrabajoEF unidadTrabajo)
        {
            _unidadTrabajo = unidadTrabajo;
        }

        public async Task<List<MysticBox.Dominio.Entidades.MysticBox>> ObtenerMysticBoxes()
        {
            var respuesta = _unidadTrabajo.TMysticBox.Listar();

            return await Task.FromResult(
                respuesta.ValorRetorno?.ToList()
                ?? new List<MysticBox.Dominio.Entidades.MysticBox>());
        }

        public async Task<MysticBox.Dominio.Entidades.MysticBox?> ObtenerMysticBoxPorId(int idCaja)
        {
            var respuesta = _unidadTrabajo.TMysticBox.ObtenerEntidad(x => x.IdCaja == idCaja);

            return await Task.FromResult(respuesta.ValorRetorno);
        }

        public async Task<MysticBox.Dominio.Entidades.MysticBox> CrearMysticBox(MysticBoxDTO mysticBoxDTO)
        {
            ValidarPromocion(mysticBoxDTO);

            var caja = new MysticBox.Dominio.Entidades.MysticBox
            {
                IdCategoria = mysticBoxDTO.IdCategoria,
                NombreCaja = mysticBoxDTO.NombreCaja,
                Descripcion = mysticBoxDTO.Descripcion,
                Precio = mysticBoxDTO.Precio,
                Imagen = mysticBoxDTO.Imagen,
                Stock = mysticBoxDTO.Stock,
                Estado = mysticBoxDTO.Estado,
                EsOferta = mysticBoxDTO.EsOferta ?? false,
                PorcentajeOferta = (mysticBoxDTO.EsOferta ?? false) ? mysticBoxDTO.PorcentajeOferta : null,
                EsRecomendada = mysticBoxDTO.EsRecomendada ?? false,
                EsDestacada = mysticBoxDTO.EsDestacada ?? false
            };

            _unidadTrabajo.TMysticBox.Insertar(caja);
            _unidadTrabajo.Completar();

            return await Task.FromResult(caja);
        }

        public async Task<bool> ActualizarMysticBox(int idCaja, MysticBoxDTO mysticBoxDTO)
        {
            ValidarPromocion(mysticBoxDTO);

            var respuesta = _unidadTrabajo.TMysticBox.ObtenerEntidad(x => x.IdCaja == idCaja);

            if (respuesta.ValorRetorno == null)
                return false;

            var caja = respuesta.ValorRetorno;

            caja.IdCategoria = mysticBoxDTO.IdCategoria;
            caja.NombreCaja = mysticBoxDTO.NombreCaja;
            caja.Descripcion = mysticBoxDTO.Descripcion;
            caja.Precio = mysticBoxDTO.Precio;
            caja.Imagen = mysticBoxDTO.Imagen;
            caja.Stock = mysticBoxDTO.Stock;
            caja.Estado = mysticBoxDTO.Estado;
            if (mysticBoxDTO.EsOferta.HasValue)
            {
                caja.EsOferta = mysticBoxDTO.EsOferta.Value;
                caja.PorcentajeOferta = mysticBoxDTO.EsOferta.Value
                    ? mysticBoxDTO.PorcentajeOferta
                    : null;
            }

            if (mysticBoxDTO.EsRecomendada.HasValue)
                caja.EsRecomendada = mysticBoxDTO.EsRecomendada.Value;

            if (mysticBoxDTO.EsDestacada.HasValue)
                caja.EsDestacada = mysticBoxDTO.EsDestacada.Value;

            _unidadTrabajo.TMysticBox.Modificar(caja);
            _unidadTrabajo.Completar();

            return true;
        }

        public async Task<bool> EliminarMysticBox(int idCaja)
        {
            var respuesta = _unidadTrabajo.TMysticBox.ObtenerEntidad(x => x.IdCaja == idCaja);

            if (respuesta.ValorRetorno == null)
                return false;

            _unidadTrabajo.TMysticBox.Eliminar(respuesta.ValorRetorno);
            _unidadTrabajo.Completar();

            return true;
        }

        private static void ValidarPromocion(MysticBoxDTO dto)
        {
            if (dto.EsOferta != true)
                return;

            if (!dto.PorcentajeOferta.HasValue ||
                dto.PorcentajeOferta.Value <= 0 ||
                dto.PorcentajeOferta.Value >= 100)
            {
                throw new ArgumentException(
                    "Cuando una caja está en oferta debe indicar un porcentaje mayor que 0 y menor que 100.");
            }
        }
    }
}

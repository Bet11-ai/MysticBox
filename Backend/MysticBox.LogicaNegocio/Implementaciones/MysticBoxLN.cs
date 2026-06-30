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
            var caja = new MysticBox.Dominio.Entidades.MysticBox
            {
                IdCategoria = mysticBoxDTO.IdCategoria,
                NombreCaja = mysticBoxDTO.NombreCategoria,
                Descripcion = mysticBoxDTO.Descripcion,
                Precio = mysticBoxDTO.Precio,
                Imagen = mysticBoxDTO.Imagen,
                Stock = mysticBoxDTO.Stock,
                Estado = mysticBoxDTO.Estado
            };

            _unidadTrabajo.TMysticBox.Insertar(caja);
            _unidadTrabajo.Completar();

            return await Task.FromResult(caja);
        }

        public async Task<bool> ActualizarMysticBox(int idCaja, MysticBoxDTO mysticBoxDTO)
        {
            var respuesta = _unidadTrabajo.TMysticBox.ObtenerEntidad(x => x.IdCaja == idCaja);

            if (respuesta.ValorRetorno == null)
                return false;

            var caja = respuesta.ValorRetorno;

            caja.IdCategoria = mysticBoxDTO.IdCategoria;
            caja.NombreCaja = mysticBoxDTO.NombreCategoria;
            caja.Descripcion = mysticBoxDTO.Descripcion;
            caja.Precio = mysticBoxDTO.Precio;
            caja.Imagen = mysticBoxDTO.Imagen;
            caja.Stock = mysticBoxDTO.Stock;
            caja.Estado = mysticBoxDTO.Estado;

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
    }
}

using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MysticBox.LogicaNegocio.Implementaciones
{
    public class WhiteListLN : IWhiteListLN
    {
        private readonly IUnidadTrabajoEF _unidadTrabajo;

        public WhiteListLN(IUnidadTrabajoEF unidadTrabajo)
        {
            _unidadTrabajo = unidadTrabajo;
        }

        public async Task<List<WhiteList>> ObtenerWhiteLists()
        {
            var respuesta = _unidadTrabajo.TWhiteList.Listar();

            return await Task.FromResult(respuesta.ValorRetorno?.ToList() ?? new List<WhiteList>());
        }

        public async Task<WhiteList?> ObtenerWhiteListPorId(int idWhiteList)
        {
            var respuesta = _unidadTrabajo.TWhiteList.ObtenerEntidad(x => x.IdWhiteList == idWhiteList);

            return await Task.FromResult(respuesta.ValorRetorno);
        }

        public async Task<WhiteList> CrearWhiteList(WhiteListDTO whiteListDTO)
        {
            var whiteList = new WhiteList
            {
                Correo = whiteListDTO.Correo,
                Activo = whiteListDTO.Activo,
                FechaRegistro = whiteListDTO.FechaRegistro
            };

            _unidadTrabajo.TWhiteList.Insertar(whiteList);
            _unidadTrabajo.Completar();

            return await Task.FromResult(whiteList);
        }

        public async Task<bool> ActualizarWhiteList(int idWhiteList, WhiteListDTO whiteListDTO)
        {
            var respuesta = _unidadTrabajo.TWhiteList.ObtenerEntidad(x => x.IdWhiteList == idWhiteList);

            if (respuesta.ValorRetorno == null)
                return false;

            var whiteList = respuesta.ValorRetorno;

            whiteList.Correo = whiteListDTO.Correo;
            whiteList.Activo = whiteListDTO.Activo;
            whiteList.FechaRegistro = whiteListDTO.FechaRegistro;

            _unidadTrabajo.TWhiteList.Modificar(whiteList);
            _unidadTrabajo.Completar();

            return true;
        }
        public async Task<bool> EliminarWhiteList(int idWhiteList)
        {
            var respuesta = _unidadTrabajo.TWhiteList.ObtenerEntidad(x => x.IdWhiteList == idWhiteList);

            if (respuesta.ValorRetorno == null)
                return false;

            var whiteList = respuesta.ValorRetorno;

            _unidadTrabajo.TWhiteList.Eliminar(whiteList);
            _unidadTrabajo.Completar();

            return true;
        }
    }

 }


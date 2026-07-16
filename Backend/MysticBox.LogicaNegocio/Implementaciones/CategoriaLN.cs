using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones
{
    public class CategoriaLN : ICategoriaLN
    {
        private readonly ICategoriaAD _categoriaAD;

        public CategoriaLN(ICategoriaAD categoriaAD)
        { 
        _categoriaAD = categoriaAD;
        }
        public async Task<List<Categoria>> ObtenerCategorias()
        {
            return await _categoriaAD.ObtenerCategorias();
        }

        public async Task<Categoria?> ObtenerCategoriaPorId(int idCategoria)
        {
            return await _categoriaAD.ObtenerCategoriaPorId(idCategoria);
        }
        public async Task<Categoria> CrearCategoria(CategoriaDTO categoriaDTO)
        {
            var categoria = new Categoria
            {
                NombreCategoria = categoriaDTO.NombreCategoria,
                Descripcion = categoriaDTO.Descripcion
            };
            return await _categoriaAD.CrearCategoria(categoria);
        }
        public async Task<bool> ActualizarCategoria(int idCategoria, CategoriaDTO categoriaDTO)
        {
            var categoria = new Categoria
            {
                IdCategoria = idCategoria,
                NombreCategoria = categoriaDTO.NombreCategoria,
                Descripcion = categoriaDTO.Descripcion
            };
            return await _categoriaAD.ActualizarCategoria(idCategoria, categoria);
        }
        public async Task<bool> EliminarCategoria(int idCategoria)
        {
            return await _categoriaAD.EliminarCategoria(idCategoria);
        }

    }
}

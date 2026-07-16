using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.DTO;

namespace MysticBox.Dominio.InterfacesLN
{
    public interface ICategoriaLN
    {
        Task<List<Categoria>> ObtenerCategorias();

        Task<Categoria?> ObtenerCategoriaPorId(int idCategoria);

        Task<Categoria> CrearCategoria(CategoriaDTO categoriaDTO);

        Task<bool> ActualizarCategoria(int idCategoria, CategoriaDTO categoriaDTO);

        Task<bool> EliminarCategoria(int idCategoria);
    }
}

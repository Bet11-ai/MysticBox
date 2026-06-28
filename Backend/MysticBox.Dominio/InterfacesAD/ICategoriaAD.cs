using MysticBox.Dominio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MysticBox.Dominio.InterfacesAD
{
    public interface ICategoriaAD
    {
        Task<List<Categoria>> ObtenerCategorias();

        Task<Categoria?> ObtenerCategoriaPorId(int idCategoria);

        Task<Categoria> CrearCategoria(Categoria categoria);

        Task<bool> ActualizarCategoria(int idCategoria, Categoria categoria);

        Task<bool> EliminarCategoria(int idCategoria);


    }
}

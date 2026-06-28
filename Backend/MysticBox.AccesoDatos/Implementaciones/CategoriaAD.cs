using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using Microsoft.EntityFrameworkCore;
using MysticBox.AccesoDatos.Contexto;

//using System.Data.SqlClient;
//using System.Linq;
//using System.Text;


namespace MysticBox.AccesoDatos.Implementaciones
{
    public class CategoriaAD : ICategoriaAD
    {
        private readonly MysticBoxContext _context;

        public CategoriaAD(MysticBoxContext context)
        {
            _context = context;
        }

        //Obtener categorias
        public async Task<List<Categoria>> ObtenerCategorias()
        {
            return await _context.Categorias.ToListAsync();
        }

        //Obtener por Id
        public async Task<Categoria?> ObtenerCategoriaPorId(int idCategoria)
        {
            return await _context.Categorias
                .FirstOrDefaultAsync(c => c.IdCategoria == idCategoria);
        }


        //Crear Categorias
        public async Task<Categoria> CrearCategoria(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return categoria;
        }


        //Actualiza Categorias
        public async Task<bool> ActualizarCategoria(int idCategoria, Categoria categoria)
        {
            var existente = await _context.Categorias.FindAsync(idCategoria);

            if (existente == null) 
                
                    return false;

            existente.NombreCategoria = categoria.NombreCategoria;
            existente.Descripcion = categoria.Descripcion;

            await _context.SaveChangesAsync();

            return true;
        }

        //Elimina categorias
        public async Task<bool> EliminarCategoria(int idCategoria)
        {
            var categoria = await _context.Categorias.FindAsync(idCategoria);

            if (categoria == null) return false;

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
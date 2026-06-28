using Microsoft.EntityFrameworkCore;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Utilitarios;
using System.Linq.Expressions;

namespace MysticBox.AccesoDatos.Implementaciones;

public class RepositorioAD<TEntity> : IRepositorioAD<TEntity> where TEntity : class
{
    protected readonly DbContext _context;

    public RepositorioAD(DbContext context)
    {
        _context = context;
    }

    public Respuesta<TEntity> Insertar(TEntity objEntidad)
    {
        var respuesta = new Respuesta<TEntity>();
        _context.Set<TEntity>().Add(objEntidad);
        respuesta.ValorRetorno = objEntidad;
        return respuesta;
    }

    public Respuesta<TEntity> Modificar(TEntity objEntidad)
    {
        var respuesta = new Respuesta<TEntity>();
        _context.Set<TEntity>().Update(objEntidad);
        respuesta.ValorRetorno = objEntidad;
        return respuesta;
    }

    public Respuesta<bool> Eliminar(TEntity objEntidad)
    {
        var respuesta = new Respuesta<bool>();
        _context.Entry(objEntidad).State = EntityState.Deleted;
        respuesta.ValorRetorno = true;
        return respuesta;
    }

    public Respuesta<IEnumerable<TEntity>> Listar(List<string>? objIncludes = null)
    {
        var respuesta = new Respuesta<IEnumerable<TEntity>>();
        IQueryable<TEntity> consulta = _context.Set<TEntity>();

        if (objIncludes != null)
            objIncludes.ForEach(x => consulta = consulta.Include(x));

        respuesta.ValorRetorno = consulta.ToList();
        return respuesta;
    }

    public Respuesta<IEnumerable<TEntity>> Buscar(Expression<Func<TEntity, bool>> objPredicado, List<string>? objIncludes = null)
    {
        var respuesta = new Respuesta<IEnumerable<TEntity>>();
        IQueryable<TEntity> consulta = _context.Set<TEntity>();

        if (objIncludes != null)
            objIncludes.ForEach(x => consulta = consulta.Include(x));

        respuesta.ValorRetorno = consulta.Where(objPredicado).ToList();
        return respuesta;
    }

    public Respuesta<TEntity> ObtenerEntidad(Expression<Func<TEntity, bool>> objPredicado, List<string>? objIncludes = null)
    {
        var respuesta = new Respuesta<TEntity>();
        IQueryable<TEntity> consulta = _context.Set<TEntity>();

        if (objIncludes != null)
            objIncludes.ForEach(x => consulta = consulta.Include(x));

        respuesta.ValorRetorno = consulta.FirstOrDefault(objPredicado);
        return respuesta;
    }

    public Respuesta<int?> Contar(Expression<Func<TEntity, bool>> objPredicado, List<string>? objIncludes = null)
    {
        var respuesta = new Respuesta<int?>();
        IQueryable<TEntity> consulta = _context.Set<TEntity>();

        if (objIncludes != null)
            objIncludes.ForEach(x => consulta = consulta.Include(x));

        respuesta.ValorRetorno = consulta.Count(objPredicado);
        return respuesta;
    }
}
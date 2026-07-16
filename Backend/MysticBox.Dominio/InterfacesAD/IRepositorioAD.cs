
using System.Linq.Expressions;
using MysticBox.Utilitarios;
using System.Linq.Expressions;

namespace MysticBox.Dominio.InterfacesAD;

public interface IRepositorioAD<TEntity> where TEntity : class
{
    Respuesta<TEntity> Insertar(TEntity objEntidad);

    Respuesta<TEntity> Modificar(TEntity objEntidad);

    Respuesta<bool> Eliminar(TEntity objEntidad);

    Respuesta<IEnumerable<TEntity>> Listar(List<string>? objIncludes = null);

    Respuesta<IEnumerable<TEntity>> Buscar(Expression<Func<TEntity, bool>> objPredicado, List<string>? objIncludes = null);

    Respuesta<TEntity> ObtenerEntidad(Expression<Func<TEntity, bool>> objPredicado, List<string>? objIncludes = null);

    Respuesta<int?> Contar(Expression<Func<TEntity, bool>> objPredicado, List<string>? objIncludes = null);
}
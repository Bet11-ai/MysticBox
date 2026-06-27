using MysticBox.Dominio.DTO;
using MysticBox.Dominio.Entidades;
using MysticBox.Dominio.InterfacesAD;
using MysticBox.Dominio.InterfacesLN;

namespace MysticBox.LogicaNegocio.Implementaciones;

public class AuthLN : IAuthLN
{
    private readonly IUnidadTrabajoEF _unidadTrabajo;

    public AuthLN(IUnidadTrabajoEF unidadTrabajo)
    {
        _unidadTrabajo = unidadTrabajo;
    }

    public async Task<Usuario?> Login(LoginDTO loginDTO)
    {
        var respuesta = _unidadTrabajo.TUsuario.ObtenerEntidad(x =>
            x.Correo == loginDTO.Correo &&
            x.Contrasena == loginDTO.Contrasena &&
            x.Estado == true);

        return await Task.FromResult(respuesta.ValorRetorno);
    }

    public async Task<Usuario> Registro(RegistroDTO registroDTO)
    {
        var usuario = new Usuario
        {
            IdRol = registroDTO.IdRol,
            Nombre = registroDTO.Nombre,
            Correo = registroDTO.Correo,
            Telefono = registroDTO.Telefono,
            Direccion = registroDTO.Direccion,
            Contrasena = registroDTO.Contrasena,
            FechaRegistro = DateTime.Now,
            Estado = true
        };

        _unidadTrabajo.TUsuario.Insertar(usuario);
        _unidadTrabajo.Completar();

        return await Task.FromResult(usuario);
    }
}
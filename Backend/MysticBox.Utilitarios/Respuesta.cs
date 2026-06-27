namespace MysticBox.Utilitarios;

public class Respuesta<T>
{
    public bool Exitoso { get; set; } = true;

    public string Mensaje { get; set; } = string.Empty;

    public T? Datos { get; set; }

    // Compatible con el repositorio genérico
    public T? ValorRetorno
    {
        get => Datos;
        set => Datos = value;
    }

    public void lpError(string mensaje)
    {
        Exitoso = false;
        Mensaje = mensaje;
    }
}
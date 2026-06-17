namespace MysticBox.Utilitarios;

public class Respuesta<T>
{
    public bool Exitoso { get; set; }
    public string Mensaje { get; set; } = string.Empty;
    public T? Datos { get; set; }
}
namespace YourNamespace.Models

{
  public class User

  {
    public int Id { get; set; } // กำหนดให้ Id เป็น Primary Key
    public string? full_name { get; set; }
    public string? email { get; set; }
    public string? password_hash { get; set; }
    public string? phone_number { get; set; }
    public int role { get; set; }
  }
}
using Microsoft.AspNetCore.Identity.UI.Services;
using System.Threading.Tasks;

public class EmailSender : IEmailSender
{
  public Task SendEmailAsync(string email, string subject, string htmlMessage)
  {
    // Simulerer sending av e-post (ingen e-post sendes faktisk)
    return Task.CompletedTask;
  }
}

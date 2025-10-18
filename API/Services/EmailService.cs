using System;
using System.Net;
using System.Net.Mail;

namespace API.Services;

public class EmailService
{
private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var smtp = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential(_config["Email:Username"], _config["Email:Password"]),
            EnableSsl = true,
        };

        var mail = new MailMessage
        {
            From = new MailAddress(_config["Email:Username"], "Chating App"),
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
        };

        mail.To.Add(toEmail);
        await smtp.SendMailAsync(mail);
    }
}


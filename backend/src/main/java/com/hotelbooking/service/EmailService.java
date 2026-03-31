package com.hotelbooking.service;

import com.hotelbooking.model.Booking;
import com.hotelbooking.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendWelcomeEmail(User user) {
        try {
            String subject = "Welcome to LuxeStay!";
            String body = buildWelcomeEmail(user);
            sendEmail(user.getEmail(), subject, body);
            log.info("Welcome email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    @Async
    public void sendBookingConfirmationEmail(Booking booking) {
        try {
            String subject = "Booking Confirmed - " + booking.getBookingReference();
            String body = buildBookingConfirmationEmail(booking);
            sendEmail(booking.getUser().getEmail(), subject, body);
            log.info("Booking confirmation email sent for booking {}", booking.getBookingReference());
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email: {}", e.getMessage());
        }
    }

    @Async
    public void sendBookingCancellationEmail(Booking booking) {
        try {
            String subject = "Booking Cancelled - " + booking.getBookingReference();
            String body = buildBookingCancellationEmail(booking);
            sendEmail(booking.getUser().getEmail(), subject, body);
            log.info("Booking cancellation email sent for booking {}", booking.getBookingReference());
        } catch (Exception e) {
            log.error("Failed to send booking cancellation email: {}", e.getMessage());
        }
    }

    private void sendEmail(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        mailSender.send(message);
    }

    private String buildWelcomeEmail(User user) {
        return """
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #1e3a5f, #2d5a8e); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #c9a84c; margin: 0;">LuxeStay</h1>
                    <p style="color: white; margin: 5px 0;">Your Premium Hotel Booking Experience</p>
                  </div>
                  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #1e3a5f;">Welcome, %s!</h2>
                    <p>Thank you for joining LuxeStay. Your account has been created successfully.</p>
                    <p>You can now search and book hotels across India with ease.</p>
                    <div style="margin: 20px 0; padding: 15px; background: #fff3cd; border-radius: 5px;">
                      <strong>Email:</strong> %s
                    </div>
                    <p>Happy travels!</p>
                    <p style="color: #888;">The LuxeStay Team</p>
                  </div>
                </body>
                </html>
                """.formatted(user.getFirstName(), user.getEmail());
    }

    private String buildBookingConfirmationEmail(Booking booking) {
        return """
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #1e3a5f, #2d5a8e); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #c9a84c; margin: 0;">LuxeStay</h1>
                    <p style="color: white;">Booking Confirmed!</p>
                  </div>
                  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #1e3a5f;">Hello, %s!</h2>
                    <p>Your booking has been confirmed. Here are your details:</p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                      <tr style="background: #1e3a5f; color: white;">
                        <th style="padding: 10px; text-align: left;">Detail</th>
                        <th style="padding: 10px; text-align: left;">Info</th>
                      </tr>
                      <tr style="background: #fff;">
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Booking Reference</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #c9a84c; font-weight: bold;">%s</td>
                      </tr>
                      <tr style="background: #f9f9f9;">
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Hotel</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
                      </tr>
                      <tr style="background: #fff;">
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Room</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">%s - Room %s</td>
                      </tr>
                      <tr style="background: #f9f9f9;">
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Check-In</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
                      </tr>
                      <tr style="background: #fff;">
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Check-Out</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
                      </tr>
                      <tr style="background: #f9f9f9;">
                        <td style="padding: 10px;"><strong>Total Amount</strong></td>
                        <td style="padding: 10px; color: #1e3a5f; font-weight: bold;">₹%s</td>
                      </tr>
                    </table>
                    <p style="color: #888;">Thank you for choosing LuxeStay. We hope you enjoy your stay!</p>
                  </div>
                </body>
                </html>
                """.formatted(
                booking.getUser().getFirstName(),
                booking.getBookingReference(),
                booking.getRoom().getHotel().getName(),
                booking.getRoom().getRoomType().getDisplayName(),
                booking.getRoom().getRoomNumber(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getTotalAmount()
        );
    }

    private String buildBookingCancellationEmail(Booking booking) {
        return """
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #c0392b, #e74c3c); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0;">LuxeStay</h1>
                    <p style="color: white;">Booking Cancelled</p>
                  </div>
                  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #1e3a5f;">Hello, %s</h2>
                    <p>Your booking has been cancelled as requested.</p>
                    <div style="padding: 15px; background: #fff; border-left: 4px solid #e74c3c; margin: 20px 0;">
                      <strong>Cancelled Booking Reference:</strong> %s<br/>
                      <strong>Hotel:</strong> %s<br/>
                      <strong>Dates:</strong> %s to %s
                    </div>
                    <p>We hope to see you again soon. Browse our hotels at LuxeStay.</p>
                    <p style="color: #888;">The LuxeStay Team</p>
                  </div>
                </body>
                </html>
                """.formatted(
                booking.getUser().getFirstName(),
                booking.getBookingReference(),
                booking.getRoom().getHotel().getName(),
                booking.getCheckInDate(),
                booking.getCheckOutDate()
        );
    }
}

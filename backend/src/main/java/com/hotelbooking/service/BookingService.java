package com.hotelbooking.service;

import com.hotelbooking.dto.request.BookingRequest;
import com.hotelbooking.dto.response.BookingResponse;
import com.hotelbooking.exception.BadRequestException;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.exception.UnauthorizedException;
import com.hotelbooking.model.*;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.RoomRepository;
import com.hotelbooking.repository.UserRepository;
import com.hotelbooking.util.BookingReferenceGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }
        if (request.getCheckInDate().isBefore(java.time.LocalDate.now())) {
            throw new BadRequestException("Check-in date cannot be in the past");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", request.getRoomId()));

        if (!room.isAvailable()) {
            throw new BadRequestException("Room is not available");
        }

        if (request.getNumberOfGuests() > room.getMaxOccupancy()) {
            throw new BadRequestException("Number of guests exceeds room capacity of " + room.getMaxOccupancy());
        }

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                room.getId(), request.getCheckInDate(), request.getCheckOutDate());
        if (!overlapping.isEmpty()) {
            throw new BadRequestException("Room is already booked for the selected dates");
        }

        long nights = request.getCheckOutDate().toEpochDay() - request.getCheckInDate().toEpochDay();
        BigDecimal totalAmount = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        String bookingRef = BookingReferenceGenerator.generate();
        while (bookingRepository.findByBookingReference(bookingRef).isPresent()) {
            bookingRef = BookingReferenceGenerator.generate();
        }

        Booking booking = Booking.builder()
                .user(user)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .totalAmount(totalAmount)
                .numberOfGuests(request.getNumberOfGuests())
                .status(BookingStatus.CONFIRMED)
                .bookingReference(bookingRef)
                .specialRequests(request.getSpecialRequests())
                .build();

        booking = bookingRepository.save(booking);
        log.info("Booking created: {} for user {}", booking.getBookingReference(), userEmail);

        emailService.sendBookingConfirmationEmail(booking);

        return toBookingResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
        if (!isAdmin && !booking.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);
        log.info("Booking cancelled: {} by {}", booking.getBookingReference(), userEmail);

        emailService.sendBookingCancellationEmail(booking);

        return toBookingResponse(booking);
    }

    public List<BookingResponse> getUserBookings(String userEmail) {
        return bookingRepository.findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(this::toBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
        if (!isAdmin && !booking.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to view this booking");
        }

        return toBookingResponse(booking);
    }

    public List<BookingResponse> getAllBookings(Pageable pageable) {
        return bookingRepository.findAllByOrderByCreatedAtDesc(pageable)
                .getContent()
                .stream()
                .map(this::toBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse toBookingResponse(Booking booking) {
        Room room = booking.getRoom();
        Hotel hotel = room.getHotel();
        User user = booking.getUser();

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .totalAmount(booking.getTotalAmount())
                .numberOfGuests(booking.getNumberOfGuests())
                .status(booking.getStatus())
                .specialRequests(booking.getSpecialRequests())
                .numberOfNights(booking.calculateNights())
                .createdAt(booking.getCreatedAt())
                .roomId(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType())
                .roomTypeDisplay(room.getRoomType().getDisplayName())
                .hotelId(hotel.getId())
                .hotelName(hotel.getName())
                .hotelLocation(hotel.getLocation())
                .hotelImageUrl(hotel.getImageUrl())
                .userId(user.getId())
                .userEmail(user.getEmail())
                .userName(user.getFullName())
                .build();
    }
}

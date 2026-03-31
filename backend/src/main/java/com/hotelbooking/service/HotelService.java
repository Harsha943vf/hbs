package com.hotelbooking.service;

import com.hotelbooking.dto.request.HotelRequest;
import com.hotelbooking.dto.request.RoomRequest;
import com.hotelbooking.dto.response.HotelResponse;
import com.hotelbooking.dto.response.PagedResponse;
import com.hotelbooking.dto.response.RoomResponse;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.model.Hotel;
import com.hotelbooking.model.Room;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;

    public PagedResponse<HotelResponse> getAllHotels(Pageable pageable) {
        Page<Hotel> page = hotelRepository.findAll(pageable);
        List<HotelResponse> content = page.getContent().stream()
                .map(h -> toHotelResponse(h, null, null))
                .collect(Collectors.toList());
        return buildPagedResponse(content, page);
    }

    public PagedResponse<HotelResponse> searchHotels(String location, LocalDate checkIn, LocalDate checkOut, Pageable pageable) {
        Page<Hotel> page;
        if (location != null && !location.isBlank()) {
            page = hotelRepository.searchHotels(location, pageable);
        } else {
            page = hotelRepository.findAll(pageable);
        }
        List<HotelResponse> content = page.getContent().stream()
                .map(h -> toHotelResponse(h, checkIn, checkOut))
                .collect(Collectors.toList());
        return buildPagedResponse(content, page);
    }

    public HotelResponse getHotelById(Long id, LocalDate checkIn, LocalDate checkOut) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", id));
        return toHotelResponse(hotel, checkIn, checkOut);
    }

    @Transactional
    public HotelResponse createHotel(HotelRequest request) {
        Hotel hotel = Hotel.builder()
                .name(request.getName())
                .description(request.getDescription())
                .location(request.getLocation())
                .address(request.getAddress())
                .starRating(request.getStarRating())
                .imageUrl(request.getImageUrl())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .checkInTime(request.getCheckInTime())
                .checkOutTime(request.getCheckOutTime())
                .amenities(request.getAmenities() != null ? request.getAmenities() : new HashSet<>())
                .build();
        hotel = hotelRepository.save(hotel);
        log.info("Hotel created: {}", hotel.getName());
        return toHotelResponse(hotel, null, null);
    }

    @Transactional
    public HotelResponse updateHotel(Long id, HotelRequest request) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", id));
        hotel.setName(request.getName());
        hotel.setDescription(request.getDescription());
        hotel.setLocation(request.getLocation());
        hotel.setAddress(request.getAddress());
        hotel.setStarRating(request.getStarRating());
        if (request.getImageUrl() != null) hotel.setImageUrl(request.getImageUrl());
        if (request.getPhoneNumber() != null) hotel.setPhoneNumber(request.getPhoneNumber());
        if (request.getEmail() != null) hotel.setEmail(request.getEmail());
        if (request.getCheckInTime() != null) hotel.setCheckInTime(request.getCheckInTime());
        if (request.getCheckOutTime() != null) hotel.setCheckOutTime(request.getCheckOutTime());
        if (request.getAmenities() != null) hotel.setAmenities(request.getAmenities());
        hotel = hotelRepository.save(hotel);
        log.info("Hotel updated: {}", hotel.getName());
        return toHotelResponse(hotel, null, null);
    }

    @Transactional
    public void deleteHotel(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", id));
        hotelRepository.delete(hotel);
        log.info("Hotel deleted: id={}", id);
    }

    @Transactional
    public RoomResponse addRoom(Long hotelId, RoomRequest request) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel", hotelId));
        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .roomType(request.getRoomType())
                .pricePerNight(request.getPricePerNight())
                .maxOccupancy(request.getMaxOccupancy())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .isAvailable(request.isAvailable())
                .amenities(request.getAmenities() != null ? request.getAmenities() : new HashSet<>())
                .hotel(hotel)
                .build();
        room = roomRepository.save(room);
        log.info("Room added to hotel {}: room {}", hotel.getName(), room.getRoomNumber());
        return toRoomResponse(room);
    }

    @Transactional
    public RoomResponse updateRoom(Long roomId, RoomRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room", roomId));
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPricePerNight(request.getPricePerNight());
        room.setMaxOccupancy(request.getMaxOccupancy());
        if (request.getDescription() != null) room.setDescription(request.getDescription());
        if (request.getImageUrl() != null) room.setImageUrl(request.getImageUrl());
        room.setAvailable(request.isAvailable());
        if (request.getAmenities() != null) room.setAmenities(request.getAmenities());
        room = roomRepository.save(room);
        return toRoomResponse(room);
    }

    @Transactional
    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room", roomId));
        roomRepository.delete(room);
        log.info("Room deleted: id={}", roomId);
    }

    private HotelResponse toHotelResponse(Hotel hotel, LocalDate checkIn, LocalDate checkOut) {
        List<Room> rooms;
        if (checkIn != null && checkOut != null) {
            rooms = roomRepository.findAvailableRooms(hotel.getId(), checkIn, checkOut);
        } else {
            rooms = roomRepository.findByHotelId(hotel.getId());
        }

        List<RoomResponse> roomResponses = rooms.stream()
                .map(this::toRoomResponse)
                .collect(Collectors.toList());

        BigDecimal startingPrice = rooms.stream()
                .map(Room::getPricePerNight)
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);

        return HotelResponse.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .description(hotel.getDescription())
                .location(hotel.getLocation())
                .address(hotel.getAddress())
                .starRating(hotel.getStarRating())
                .imageUrl(hotel.getImageUrl())
                .phoneNumber(hotel.getPhoneNumber())
                .email(hotel.getEmail())
                .checkInTime(hotel.getCheckInTime())
                .checkOutTime(hotel.getCheckOutTime())
                .amenities(hotel.getAmenities())
                .rooms(roomResponses)
                .startingPrice(startingPrice)
                .totalRooms(rooms.size())
                .createdAt(hotel.getCreatedAt())
                .build();
    }

    public RoomResponse toRoomResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType())
                .roomTypeDisplay(room.getRoomType().getDisplayName())
                .pricePerNight(room.getPricePerNight())
                .maxOccupancy(room.getMaxOccupancy())
                .description(room.getDescription())
                .imageUrl(room.getImageUrl())
                .isAvailable(room.isAvailable())
                .amenities(room.getAmenities())
                .hotelId(room.getHotel().getId())
                .hotelName(room.getHotel().getName())
                .build();
    }

    private <T> PagedResponse<T> buildPagedResponse(List<T> content, Page<?> page) {
        return PagedResponse.<T>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}

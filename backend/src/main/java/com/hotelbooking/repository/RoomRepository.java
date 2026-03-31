package com.hotelbooking.repository;

import com.hotelbooking.model.Room;
import com.hotelbooking.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByHotelId(Long hotelId);

    List<Room> findByHotelIdAndRoomType(Long hotelId, RoomType roomType);

    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.isAvailable = true " +
           "AND r.id NOT IN (" +
           "  SELECT b.room.id FROM Booking b WHERE b.status = 'CONFIRMED' " +
           "  AND NOT (b.checkOutDate <= :checkIn OR b.checkInDate >= :checkOut)" +
           ")")
    List<Room> findAvailableRooms(@Param("hotelId") Long hotelId,
                                   @Param("checkIn") LocalDate checkIn,
                                   @Param("checkOut") LocalDate checkOut);

    long countByHotelId(Long hotelId);

    long count();
}

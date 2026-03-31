package com.hotelbooking.repository;

import com.hotelbooking.model.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    Page<Hotel> findByLocationContainingIgnoreCase(String location, Pageable pageable);

    @Query("SELECT h FROM Hotel h WHERE " +
           "(:location IS NULL OR LOWER(h.location) LIKE LOWER(CONCAT('%', :location, '%'))) OR " +
           "(:location IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<Hotel> searchHotels(@Param("location") String location, Pageable pageable);

    long count();
}

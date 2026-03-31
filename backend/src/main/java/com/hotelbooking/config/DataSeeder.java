package com.hotelbooking.config;

import com.hotelbooking.model.*;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomRepository;
import com.hotelbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        seedAdmin();
        if (hotelRepository.count() == 0) {
            seedHotels();
            log.info("Sample hotels seeded successfully");
        }
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@luxestay.com")) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("LuxeStay")
                    .email("admin@luxestay.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phoneNumber("+91-9000000000")
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@luxestay.com / Admin@123");
        }
    }

    private void seedHotels() {
        // 1. Mumbai
        Hotel h1 = hotelRepository.save(Hotel.builder()
                .name("The Grand Oberoi Mumbai")
                .description("A magnificent 5-star property nestled in the heart of Mumbai's financial district. Experience world-class hospitality with breathtaking views of the Arabian Sea and the iconic Marine Drive.")
                .location("Mumbai")
                .address("Nariman Point, Mumbai, Maharashtra 400021")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800")
                .phoneNumber("+91-22-66320000")
                .email("reservations@grandoberoimumbai.com")
                .checkInTime("14:00")
                .checkOutTime("12:00")
                .amenities(Set.of("Free WiFi", "Swimming Pool", "Spa", "Gym", "Restaurant", "Bar", "Room Service", "Valet Parking", "Business Center", "Concierge"))
                .build());
        addRooms(h1,
                new RoomData("101", RoomType.STANDARD, 6500, 2, "Comfortable standard room with city view and modern amenities.", Set.of("WiFi", "AC", "TV", "Mini Bar")),
                new RoomData("201", RoomType.DELUXE, 10500, 2, "Spacious deluxe room with partial sea view and premium furnishings.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Bathtub")),
                new RoomData("301", RoomType.SUITE, 18000, 3, "Luxurious suite with panoramic sea views and separate living area.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Jacuzzi", "Lounge")),
                new RoomData("401", RoomType.PRESIDENTIAL, 45000, 4, "The ultimate in luxury — expansive presidential suite with butler service.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Jacuzzi", "Butler", "Private Dining"))
        );

        // 2. Delhi
        Hotel h2 = hotelRepository.save(Hotel.builder()
                .name("The Imperial New Delhi")
                .description("A heritage 5-star hotel in the heart of Lutyens' Delhi, combining colonial grandeur with contemporary luxury. Steps away from Connaught Place and India Gate.")
                .location("Delhi")
                .address("Janpath, New Delhi, Delhi 110001")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800")
                .phoneNumber("+91-11-23341234")
                .email("reservations@theimperialindia.com")
                .checkInTime("14:00")
                .checkOutTime("12:00")
                .amenities(Set.of("Free WiFi", "Swimming Pool", "Spa", "Gym", "Restaurant", "Bar", "Room Service", "Parking", "Heritage Tours", "Business Center"))
                .build());
        addRooms(h2,
                new RoomData("101", RoomType.STANDARD, 7200, 2, "Elegant standard room with garden views in heritage wing.", Set.of("WiFi", "AC", "TV")),
                new RoomData("201", RoomType.DELUXE, 11000, 2, "Deluxe room with antique furnishings and modern comforts.", Set.of("WiFi", "AC", "TV", "Mini Bar")),
                new RoomData("301", RoomType.SUITE, 22000, 3, "Grand suite overlooking the lush hotel gardens.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Sitting Room")),
                new RoomData("401", RoomType.PRESIDENTIAL, 55000, 4, "The Imperial Suite — unparalleled luxury with a private terrace.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Terrace", "Butler"))
        );

        // 3. Bangalore
        Hotel h3 = hotelRepository.save(Hotel.builder()
                .name("Taj West End Bangalore")
                .description("A tranquil oasis in the bustling Garden City, spread across 20 acres of tropical gardens. This century-old property blends heritage charm with modern luxury.")
                .location("Bangalore")
                .address("Race Course Road, Bangalore, Karnataka 560001")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800")
                .phoneNumber("+91-80-66605660")
                .email("westend.bangalore@taj.com")
                .checkInTime("14:00")
                .checkOutTime("12:00")
                .amenities(Set.of("Free WiFi", "Swimming Pool", "Spa", "Gym", "Restaurant", "Bar", "Room Service", "Parking", "Garden", "Tennis Court"))
                .build());
        addRooms(h3,
                new RoomData("101", RoomType.STANDARD, 5800, 2, "Garden-view room surrounded by century-old trees.", Set.of("WiFi", "AC", "TV")),
                new RoomData("201", RoomType.DELUXE, 9500, 2, "Deluxe heritage room with vintage décor and modern amenities.", Set.of("WiFi", "AC", "TV", "Mini Bar")),
                new RoomData("301", RoomType.SUITE, 16000, 3, "Garden suite with private sit-out and premium butler service.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Patio")),
                new RoomData("401", RoomType.PRESIDENTIAL, 40000, 4, "The West End Suite — epitome of garden luxury.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Private Garden", "Butler"))
        );

        // 4. Goa
        Hotel h4 = hotelRepository.save(Hotel.builder()
                .name("Leela Goa Beach Resort")
                .description("A beachfront paradise on the shores of the Arabian Sea in Cavelossim, South Goa. Lush lagoon gardens, private beach, and exquisite dining await you.")
                .location("Goa")
                .address("Mobor, Cavelossim, South Goa, Goa 403731")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800")
                .phoneNumber("+91-832-6621234")
                .email("reservations.goa@theleela.com")
                .checkInTime("15:00")
                .checkOutTime("11:00")
                .amenities(Set.of("Free WiFi", "Private Beach", "Swimming Pool", "Spa", "Gym", "Restaurant", "Bar", "Water Sports", "Kids Club", "Parking"))
                .build());
        addRooms(h4,
                new RoomData("101", RoomType.STANDARD, 8500, 2, "Lagoon-view room with tropical décor and private balcony.", Set.of("WiFi", "AC", "TV", "Balcony")),
                new RoomData("201", RoomType.DELUXE, 14000, 2, "Sea-facing deluxe room with direct beach access.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Sea View")),
                new RoomData("301", RoomType.SUITE, 25000, 4, "Beach villa suite with plunge pool and butler service.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Plunge Pool")),
                new RoomData("401", RoomType.PRESIDENTIAL, 60000, 4, "Royal Beach Villa — private beach and personalized butler.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Private Pool", "Chef"))
        );

        // 5. Jaipur
        Hotel h5 = hotelRepository.save(Hotel.builder()
                .name("Rambagh Palace Jaipur")
                .description("Once the residence of the Maharaja of Jaipur, Rambagh Palace is a jewel of Rajasthan. Experience royal living amidst magnificent Mughal gardens and palatial architecture.")
                .location("Jaipur")
                .address("Bhawani Singh Road, Jaipur, Rajasthan 302005")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800")
                .phoneNumber("+91-141-2385700")
                .email("rambagh.jaipur@tajhotels.com")
                .checkInTime("14:00")
                .checkOutTime("12:00")
                .amenities(Set.of("Free WiFi", "Swimming Pool", "Spa", "Gym", "Royal Restaurant", "Bar", "Heritage Walk", "Polo Grounds", "Camel Ride", "Parking"))
                .build());
        addRooms(h5,
                new RoomData("101", RoomType.STANDARD, 12000, 2, "Royal room with traditional Rajasthani décor and garden view.", Set.of("WiFi", "AC", "TV")),
                new RoomData("201", RoomType.DELUXE, 18000, 2, "Heritage deluxe room with original palace furnishings.", Set.of("WiFi", "AC", "TV", "Mini Bar")),
                new RoomData("301", RoomType.SUITE, 35000, 3, "Palace suite with private courtyard and royal butler.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Courtyard")),
                new RoomData("401", RoomType.PRESIDENTIAL, 80000, 4, "Maharaja Suite — the crown jewel of the palace.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Private Pool", "Royal Butler"))
        );

        // 6. Chennai
        Hotel h6 = hotelRepository.save(Hotel.builder()
                .name("ITC Grand Chola Chennai")
                .description("An architectural marvel inspired by the great Chola dynasty, ITC Grand Chola is South India's largest luxury hotel. Experience the grandeur of ancient Tamil heritage reimagined.")
                .location("Chennai")
                .address("Mount Road, Guindy, Chennai, Tamil Nadu 600032")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800")
                .phoneNumber("+91-44-22200000")
                .email("itcgrandchola@itchotels.in")
                .checkInTime("14:00")
                .checkOutTime("12:00")
                .amenities(Set.of("Free WiFi", "Swimming Pool", "Spa", "Gym", "Multiple Restaurants", "Bar", "Room Service", "Parking", "Business Center", "Concierge"))
                .build());
        addRooms(h6,
                new RoomData("101", RoomType.STANDARD, 6000, 2, "Contemporary room with city skyline view.", Set.of("WiFi", "AC", "TV")),
                new RoomData("201", RoomType.DELUXE, 9800, 2, "Deluxe room with heritage Chola-inspired interiors.", Set.of("WiFi", "AC", "TV", "Mini Bar")),
                new RoomData("301", RoomType.SUITE, 17500, 3, "Grand Chola Suite with premium amenities.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Sitting Area")),
                new RoomData("401", RoomType.PRESIDENTIAL, 42000, 4, "Presidential Suite with panoramic views of the city.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Dining Room", "Butler"))
        );

        // 7. Hyderabad
        Hotel h7 = hotelRepository.save(Hotel.builder()
                .name("Taj Falaknuma Palace Hyderabad")
                .description("Perched 2000 feet above Hyderabad, the Falaknuma Palace was the private residence of the Nizam. Now restored to its former glory, it offers an unparalleled royal experience.")
                .location("Hyderabad")
                .address("Engine Bowli, Falaknuma, Hyderabad, Telangana 500053")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800")
                .phoneNumber("+91-40-66298585")
                .email("falaknuma.hyderabad@tajhotels.com")
                .checkInTime("14:00")
                .checkOutTime("12:00")
                .amenities(Set.of("Free WiFi", "Swimming Pool", "Spa", "Gym", "Royal Dining", "Bar", "Horse Carriage", "Heritage Tour", "Parking", "Concierge"))
                .build());
        addRooms(h7,
                new RoomData("101", RoomType.STANDARD, 15000, 2, "Nizam's guest room with antique furnishings and city views.", Set.of("WiFi", "AC", "TV")),
                new RoomData("201", RoomType.DELUXE, 22000, 2, "Palace deluxe room with original royal artefacts.", Set.of("WiFi", "AC", "TV", "Mini Bar")),
                new RoomData("301", RoomType.SUITE, 40000, 3, "Grand Palace Suite overlooking the Hyderabad skyline.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Study")),
                new RoomData("401", RoomType.PRESIDENTIAL, 95000, 4, "The Nizam Suite — the most coveted room in all of Hyderabad.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Private Dining", "Butler"))
        );

        // 8. Kolkata
        Hotel h8 = hotelRepository.save(Hotel.builder()
                .name("The Oberoi Grand Kolkata")
                .description("A Victorian masterpiece in the heart of Kolkata, The Oberoi Grand has been welcoming guests since 1870. Experience colonial elegance meets modern luxury in the City of Joy.")
                .location("Kolkata")
                .address("15 Jawaharlal Nehru Road, Kolkata, West Bengal 700013")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1606046604972-77cc76aee944?w=800")
                .phoneNumber("+91-33-22492323")
                .email("reservations@oberoikolkata.com")
                .checkInTime("14:00")
                .checkOutTime("12:00")
                .amenities(Set.of("Free WiFi", "Swimming Pool", "Spa", "Gym", "Restaurant", "Bar", "Room Service", "Parking", "Heritage Walks", "Business Center"))
                .build());
        addRooms(h8,
                new RoomData("101", RoomType.STANDARD, 5500, 2, "Classic room with Victorian architectural details.", Set.of("WiFi", "AC", "TV")),
                new RoomData("201", RoomType.DELUXE, 8800, 2, "Deluxe room with pool-facing view and premium bath amenities.", Set.of("WiFi", "AC", "TV", "Mini Bar")),
                new RoomData("301", RoomType.SUITE, 15000, 3, "The Grand Suite with private lounge and colonial décor.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Lounge")),
                new RoomData("401", RoomType.PRESIDENTIAL, 38000, 4, "Presidential Suite — pinnacle of colonial luxury.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Terrace", "Butler"))
        );

        // 9. Pune
        Hotel h9 = hotelRepository.save(Hotel.builder()
                .name("JW Marriott Hotel Pune")
                .description("Located in the vibrant Senapati Bapat Road, JW Marriott Pune offers contemporary luxury in the Oxford of the East. Ideal for business travellers and leisure seekers alike.")
                .location("Pune")
                .address("Senapati Bapat Road, Pune, Maharashtra 411016")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1540541338537-41500c89b53e?w=800")
                .phoneNumber("+91-20-67010000")
                .email("reservations@jwmarriottpune.com")
                .checkInTime("15:00")
                .checkOutTime("12:00")
                .amenities(Set.of("Free WiFi", "Swimming Pool", "Spa", "Gym", "Restaurant", "Bar", "Room Service", "Parking", "Business Center", "Kids Play Area"))
                .build());
        addRooms(h9,
                new RoomData("101", RoomType.STANDARD, 5200, 2, "Modern room with city views and signature JW Marriott bedding.", Set.of("WiFi", "AC", "TV")),
                new RoomData("201", RoomType.DELUXE, 8200, 2, "Deluxe room with enhanced living space and lounge access.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Lounge Access")),
                new RoomData("301", RoomType.SUITE, 14500, 3, "JW Suite with sweeping views of Pune's skyline.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Sitting Room")),
                new RoomData("401", RoomType.PRESIDENTIAL, 36000, 4, "The Presidential Suite with private dining and butler.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Dining Room", "Butler"))
        );

        // 10. Udaipur
        Hotel h10 = hotelRepository.save(Hotel.builder()
                .name("Taj Lake Palace Udaipur")
                .description("Floating serenely on the shimmering Lake Pichola, the Taj Lake Palace is a 250-year-old royal residence turned legendary hotel. Accessible only by boat, it is the romance capital of India.")
                .location("Udaipur")
                .address("Lake Pichola, Udaipur, Rajasthan 313001")
                .starRating(5)
                .imageUrl("https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800")
                .phoneNumber("+91-294-2428800")
                .email("lakepalace.udaipur@tajhotels.com")
                .checkInTime("14:00")
                .checkOutTime("12:00")
                .amenities(Set.of("Free WiFi", "Swimming Pool", "Spa", "Gym", "Royal Restaurant", "Bar", "Boat Rides", "Yoga", "Cultural Shows", "Parking"))
                .build());
        addRooms(h10,
                new RoomData("101", RoomType.STANDARD, 16000, 2, "Lake-view room with authentic Mewar décor and marble floors.", Set.of("WiFi", "AC", "TV")),
                new RoomData("201", RoomType.DELUXE, 24000, 2, "Deluxe room with panoramic lake and Aravalli views.", Set.of("WiFi", "AC", "TV", "Mini Bar")),
                new RoomData("301", RoomType.SUITE, 48000, 3, "Grand Lake Suite with private terrace over the lake.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Lake Terrace")),
                new RoomData("401", RoomType.PRESIDENTIAL, 120000, 4, "The Royal Suite — the crown of the floating palace.", Set.of("WiFi", "AC", "TV", "Mini Bar", "Private Pool", "Royal Butler", "Boat"))
        );
    }

    private record RoomData(String number, RoomType type, int price, int maxOcc, String desc, Set<String> amenities) {}

    private void addRooms(Hotel hotel, RoomData... rooms) {
        for (RoomData rd : rooms) {
            roomRepository.save(Room.builder()
                    .roomNumber(rd.number())
                    .roomType(rd.type())
                    .pricePerNight(BigDecimal.valueOf(rd.price()))
                    .maxOccupancy(rd.maxOcc())
                    .description(rd.desc())
                    .amenities(rd.amenities())
                    .isAvailable(true)
                    .hotel(hotel)
                    .build());
        }
    }
}

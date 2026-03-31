package com.hotelbooking.model;

public enum RoomType {
    STANDARD("Standard"),
    DELUXE("Deluxe"),
    SUITE("Suite"),
    PRESIDENTIAL("Presidential Suite");

    private final String displayName;

    RoomType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

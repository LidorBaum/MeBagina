function formatParkSummaryData(park, userId) {
    return {
        name: park.name,
        address: park.address,
        city: park.city,
        coordinates: {
            lat: park.coordinates?.lat,
            lng: park.coordinates?.lng,
        },
        image: park.image,
        dogs: (park.currentDogsIds || []).length,
        favorite: (park.favUserIds || []).includes(userId),
    };
}

module.exports = {
    formatParkSummaryData,
};
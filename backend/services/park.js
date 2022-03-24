function formatParkSummaryData(park, userId) {
    return {
        _id: park._id,
        name: park.name,
        address: park.address,
        city: park.city,
        coordinates: {
            lat: park.coordinates?.lat,
            lng: park.coordinates?.lng,
        },
        image: park.image,
        dogs: (park.currentDogsIds || []).length,
        isFavorite: (park.favUserIds || []).map(userId=>userId.toString()).includes(userId),
    };
}

module.exports = {
    formatParkSummaryData,
};
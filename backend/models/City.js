const db = require('./db-connections/MeBagina-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const CitySchema = Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        isWhatsapp: {
            type: Boolean,
            required: true,
        },
    },
    {
        collection: 'Cities',
        versionKey: false,
        timestamps: true,
    }
);

ParkSchema.statics.updatePark = function (parkObj) {
    return this.findOneAndUpdate(
        { _id: parkObj._id },
        {
            $set: {
                name: parkObj.name,
                address: parkObj.address,
                city: parkObj.city,
            },
        },
        { new: true }
    );
};

ParkSchema.statics.createPark = function (parkObj) {
    return this.create(parkObj);
};

ParkSchema.statics.getAllParks = function () {
    return this.find({}).sort({ name: 1 }).exec();
};

ParkSchema.statics.getById = function (parkId) {
    return this.findById(parkId);
};

ParkSchema.statics.deletePark = function (parkId) {
    return this.deleteOne({ _id: parkId });
};

ParkSchema.statics.addUserToPark = function (parkId, userId) {
    return this.updateOne(
        { _id: parkId },
        { $addToSet: { favUserIds: userId } }
    );
};

ParkSchema.statics.deleteUserFromPark = function (parkId, userId) {
    return this.updateOne({ _id: parkId }, { $pull: { favUserIds: userId } });
};

exports.CityModel = db.connection.model('City', CitySchema);

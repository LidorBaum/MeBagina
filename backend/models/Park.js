const db = require('./db-connections/MeBagina-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const ParkSchema = Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        coordinates: {
            type: {
                lat: {
                    type: String,
                },
                lng: {
                    type: String,
                },
            },
            required: true,
        },
        currentDogsIds: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Dog',
                },
            ],
            default: [],
        },
        chatId: {
            type: Schema.Types.ObjectId,
            // required: true,
            ref: 'Chat',
        },
    },
    {
        collection: 'Parks',
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

exports.ParkModel = db.connection.model('Park', ParkSchema);

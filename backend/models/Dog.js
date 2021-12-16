const db = require('./db-connections/MeBagina-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const DogSchema = Schema(
    {
        name: {
            type: String,
            required: true,
        },
        breed: {
            type: String,
            required: true
        },
        photoUrl: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        additionalInfo: {
            type: String,
            default: ''
        },
        currentParkId: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'Park'
        }
    },
    {
        collection: 'dogs',
        versionKey: false,
        timestamps: true,
    }
)

exports.ParksModel = db.connection.model('Dog', ParkSchema);

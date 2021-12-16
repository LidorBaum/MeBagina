const db = require('./db-connections/MeBagina-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const ParkSchema = Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        currentDogsIds: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Dog'
                }
            ],
            default: []
        },
        chatId:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Chat'
        },
    },
    {
        collection: 'parks',
        versionKey: false,
        timestamps: true,
    }
)

exports.ParksModel = db.connection.model('Park', ParkSchema);

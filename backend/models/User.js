const db = require('./db-connections/MeBagina-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const UserSchema = Schema(
    {
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        dogsIds: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Dog'
                }
            ],
            default: []
        },
    },
    {
        collection: 'Users',
        versionKey: false,
        timestamps: true,
    }
)

exports.UsersModel = db.connection.model('User', UserSchema);

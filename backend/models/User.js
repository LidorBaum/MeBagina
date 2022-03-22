const db = require('./db-connections/MeBagina-db');
const Libs = require('../libs');

const Schema = db.mongoose.Schema;

const UserSchema = Schema(
    {
        firebaseUID: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        dogsIds: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Dog',
                },
            ],
            default: [],
        },
    },
    {
        collection: 'Users',
        versionKey: false,
        timestamps: true,
    }
);

UserSchema.statics.linkDogToUser = function (userId, dogId) {
    return this.findOneAndUpdate(
        {
            _id: userId,
        },
        {
            $addToSet: {
                dogsIds: dogId,
            },
        }
    );
};

UserSchema.statics.createUser = function (userObj) {
    return this.create(userObj);
};

UserSchema.statics.getUserByUID = function (firebaseUID) {
    return this.findOne({ firebaseUID: firebaseUID });
};

UserSchema.statics.checkEmailAvailable = function (email) {
    console.log(email, 'email is ');
    return this.findOne({ email: email });
};

UserSchema.statics.getByEmail = async function (email) {
    console.log('getting by email');
    const user = await this.findOne({ email: email });
    console.log(user, 'USER FROM EMAIL');
    return user;
};

UserSchema.statics.getAllUsers = function () {
    return this.find({}).sort({ name: 1 }).exec();
};

UserSchema.statics.getById = function (userId) {
    return this.findById(userId);
};

UserSchema.statics.deleteUser = function (userId) {
    return this.deleteOne({ _id: userId });
};

UserSchema.statics.updateUser = function (userObj) {
    return this.findOneAndUpdate(
        { _id: userObj._id },
        {
            $set: {
                name: userObj.name,
                email: userObj.email,
            },
        },
        { new: true }
    );
};

exports.UserModel = db.connection.model('User', UserSchema);

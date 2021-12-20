const db = require("./db-connections/MeBagina-db");
const Libs = require("../libs");

const Schema = db.mongoose.Schema;

const DogSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    additionalInfo: {
      type: String,
      default: "",
    },
    // currentDogId: {
    //     type: Schema.Types.ObjectId,
    //     default: null,
    //     ref: "Dog",
    // },
  },
  {
    collection: "Dogs",
    versionKey: false,
    timestamps: true,
  }
);

DogSchema.statics.createDog = async function (dogObj) {
  return this.create(dogObj);
};

DogSchema.statics.getAllDogs = function () {
  return this.find({}).sort({ name: 1 }).exec();
};

DogSchema.statics.getById = function (dogId) {
  return this.findById(dogId);
};

DogSchema.statics.deleteDog = function (dogId) {
  return this.deleteOne({ _id: dogId });
};

DogSchema.statics.updateDog = function (dogObj) {
  return this.findOneAndUpdate(
    { _id: dogObj._id },
    {
      $set: {
        name: dogObj.name,
        breed: dogObj.breed,
        photoUrl: dogObj.photoUrl,
        additionalInfo: dogObj.additionalInfo,
      },
    },
    { new: true }
  );
};

exports.DogModel = db.connection.model("Dog", DogSchema);

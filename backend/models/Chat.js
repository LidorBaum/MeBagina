const db = require("./db-connections/MeBagina-db");
const Libs = require("../libs");

const Schema = db.mongoose.Schema;

const ChatSchema = Schema(
  {
    parkId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Park",
    },
    activeUsersIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    messages: {
      type: [
        {
          senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          text: {
            type: String,
            required: true,
          },
          sentAt: {
            type: Date,
            default: Date.now,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  {
    collection: "Chats",
    versionKey: false,
    timestamps: true,
  }
);

exports.ChatModel = db.connection.model("Chat", ChatSchema);

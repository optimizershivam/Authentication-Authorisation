
const mongoose = require("mongoose")

const notesSchema = new mongoose.Schema({
   title : String,
   label : String,
   tag : String,
   user_id : {type : String, default : ""}
})


const NotesModel = mongoose.model("notes", notesSchema)

module.exports = NotesModel




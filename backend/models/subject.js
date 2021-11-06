const mongoose = require('mongoose');

const listVisitSchema = mongoose.Schema({
    sv_visitedDate:String,
    sv_Height:Number,
    sv_Weight:Number,
    sv_Temp:Number,
    sv_Pulse:Number,
    sv_Oxy:Number,
    sv_bp_sys:Number,
    sv_bp_dia:Number,
    sv_symptoms:{type:String, required: true}, 
    sv_prescription:{type:String, required: true},
    // sv_isLabreqd:Boolean,
    sv_lab:String,
    // sv_isScanReqd:Boolean,
    sv_scan:String,
    // sv_isFollowUp:Boolean,
    sv_nextDate:String,
    sv_attachment:String
    })
  
const subjectSchema =  mongoose.Schema({
    subjectID: String,
    subjectAadhar: {type:String, required: true},
    subjectName: {type:String, required: true},
    subjectDOB: String,
    subjectGender: String,
    subjectAddress: String,
    subjectPhoneNo: {type:String, required: true},
    subjectEmailID: String,
    lastUpdatedDate: Date,
    listOfVisits:[listVisitSchema],
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Subject', subjectSchema);
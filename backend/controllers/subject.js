const Subject = require('../models/subject');

var subjectsCount = 0;

isDate = (date) => {
    return (new Date(date) !== "Invalid Date" && !isNaN(new Date(date)))
}

isNumeric = (num) => {
    return !isNaN(num);
}

padLeft = (nr, n, str) => {
    return Array(n - String(nr).length + 1).join(str || "0") + nr;
}


// exports.createSubject=(req, res, next) =>{
//     // const subject=req.body;
//     console.log(req.body);
//     const subject=new Subject({
//         subjectAadhar: req.body.subjectAadhar,
//         subjectName: req.body.subjectName,
//         creator:req.userData.userId
//     });
//     subject.save().then(createdSubject=>{
//         console.log("subject added success")
//         console.log(createdSubject._id)
//         res.status(201).json({
//             message:"Subject added successfully!",
//             subject: {
//                 ...createdSubject,
//                 id:createdSubject._id
//             }
//         });
//     })
//     .catch(error=>{
//         res.status(500).json({message:'Creating a Subject failed!'})
//     });
// }

// exports.updateSubject=(req, res, next)=>{
//     const subject = new Subject({
//         _id:req.body._id,
//         subjectAadhar: req.body.subjectAadhar,
//         subjectName: req.body.subjectName,
//         creator:req.userData.userId
//     })
//     Subject.updateOne({_id:req.params.id,creator: req.userData.userId}, subject)
//         .then(result=>{
//             console.log("updateSubject")
//             console.log(result)
//             // if(result.modifiedCount>0)
//             //if(result.acknowledged)
//             if(result.matchedCount>0){
//                 res.status(200).json({message:"Subject updated successfully!"});
//             }else{
//                 res.status(401).json({message:"Not Authorized"})
//             }
//         })
//         .catch(error=>{
//             res.status(500).json({message:'Updating a Subject failed!'})
//         });
// }

exports.getSubjects = (req, res, next) => {

    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.currentpage;
    const subjectQuery = Subject.find();
    let fetchedSubjects;
    if (pageSize && currentPage) {
        subjectQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    subjectQuery
        .then(documents => {
            fetchedSubjects = documents;
            return Subject.count();
        })
        .then(count => {
            res.status(200).json({
                message: "Subject fetched successfully",
                subjects: fetchedSubjects,
                maxSubjects: count
            });
        })
        .catch(error => {
            res.status(500).json({ message: 'Fetching Subjects failed!' })
        });
}

exports.getSubject = (req, res, next) => {
    Subject.findById(req.params.id)
        .then(subject => {
            if (subject) {
                res.status(200).json(subject)
            } else {
                res.status(404).json({ message: "Subject not found" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Fetching Subject failed by ID!' })
        });
}



exports.searchSubject = (req, res, next) => {
   //console.log(req.query)

   const pageSize=+req.query.pagesize;
   const currentPage= +req.query.currentpage;
   const searchText= req.query.searchtext;
   
// console.log(req.query);
// console.log(searchText)
   let subjectCount=Subject.count()    
   let subjectQuery=Subject.find();
   let fetchedSubjects;
   
   
   if(searchText ){
       // console.log("inside")
       // console.log(searchText)
       if(searchText!=""){
       var regexValue = '\.*'+searchText.toLowerCase().trim()+'\.*';
       const CheckValue =new RegExp(regexValue,'i');
      
       subjectQuery = Subject.find({ $and: [{ $or: [{ 'subjectID': CheckValue }, { 'subjectAadhar': CheckValue }, { 'subjectName': CheckValue }, { 'subjectAddress': CheckValue }, { 'subjectPhoneNo': CheckValue }, { 'subjectEmailID': CheckValue }, { 'listOfVisits.sv_symptoms': CheckValue }, { 'listOfVisits.sv_prescription': CheckValue }] }] }).sort({ lastUpdatedDate: -1 });
       subjectCount= Subject.count({ $and: [{ $or: [{ 'subjectID': CheckValue }, { 'subjectAadhar': CheckValue }, { 'subjectName': CheckValue }, { 'subjectAddress': CheckValue }, { 'subjectPhoneNo': CheckValue }, { 'subjectEmailID': CheckValue }, { 'listOfVisits.sv_symptoms': CheckValue }, { 'listOfVisits.sv_prescription': CheckValue }] }] }).sort({ lastUpdatedDate: -1 });
       }     
   }
//    subjectQuery
//    .then(documents => {
//        fetchedSubjects = documents;
//        console.log("documents.length");
//        console.log(documents.length);
//    })

// console.log("subjectCount")
// console.log(subjectCount)
subjectCount.then(doc=>{
    if (pageSize && currentPage) {
        subjectQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    subjectQuery
        .then(documents => {
            fetchedSubjects = documents;
            // return Subject.count();
        })
        .then(count => {
            res.status(200).json({
                message: "Subject fetched successfully",
                subjects: fetchedSubjects,
                maxSubjects: doc
            });
        })
        .catch(error => {
            res.status(500).json({ message: 'Fetching Subjects failed!' })
        });
}).catch(error=>{
    res.status(500).json({ message: 'Fetching Subjects count failed!' })
})
   

        // let asdf_cnt= subjectCount.then(doc=>{
        //     console.log("doc")
        //     console.log(doc)
        //     return doc
        // })
        // console.log("asdf_cnt")
        // console.log(asdf_cnt.resolve())
        // console.log("subjectCount")

}

// exports.generateSubjectId = (req, res, next)=>{

//     let fetchedSubjects;
//     let lastSubject;

//     // Subject.find().sort({"_id":-1}).limit(1).then(subject=>{lastSubject=subject}).catch(console.log("Unable to get last subject"))
//     // console.log(lastSubject)
//     Subject.find()
//         .then(subjects=>{
//             fetchedSubjects=subjects;
//             return Subject.count();
//         })
//         .then(count=>{
//             if(fetchedSubjects[count-1]){
//                 lastSubject=fetchedSubjects[count-1]
//             }else{
//                 lastSubject={subjectID:"0"}
//             }
//             res.status(200).json({
//                 message:"Last Subject details fetched successfully!!", 
//                 lastSubjectID:lastSubject.subjectID,
//                 maxSubjects:count
//             });
//         })
//         .catch((error)=>{
//             // console.log("Unable to get subjects")
//             res.status(500).json({message:'Failed to fetch Subject GenID!'})
//         });
// }

exports.createSubject = (req, res, next) => {
    console.log(req.body)

    // subjectDataArray = [];
    // for(let i=0;i<req.body.listOfItems.length;i++){
    //     subjectDataArray.push({item_id:"", itemName:"", itemCostPrice: 0, itemSellingPrice: 0, item_qty:0, quantity:0, cpCost:0, spCost:0, profit:0 });

    //     subjectDataArray[i].item_id=req.body.listOfItems[i].item_id
    //     subjectDataArray[i].itemName=req.body.listOfItems[i].itemName
    //     subjectDataArray[i].itemCostPrice=req.body.listOfItems[i].itemCostPrice
    //     subjectDataArray[i].itemSellingPrice=req.body.listOfItems[i].itemSellingPrice
    //     subjectDataArray[i].item_qty=req.body.listOfItems[i].item_qty
    //     subjectDataArray[i].quantity=req.body.listOfItems[i].quantity
    //     subjectDataArray[i].quantity_copy=req.body.listOfItems[i].quantity_copy
    //     subjectDataArray[i].cpCost=req.body.listOfItems[i].cpCost
    //     subjectDataArray[i].spCost=req.body.listOfItems[i].spCost
    //     subjectDataArray[i].profit=req.body.listOfItems[i].profit
    //     subjectDataArray[i].itemHSN=req.body.listOfItems[i].itemHSN

    // }

    // console.log(subjectDataArray);

    /*
        clientName: req.body.clientName,
        clientPhoneNo: req.body.clientPhoneNo,
        amountPaid: req.body.amountPaid,
        totalCost: req.body.totalCost,
        lastUpdatedDate: req.body.lastUpdatedDate,
        purchasedDate: req.body.purchasedDate,
        listOfItems: subjectDataArray
        
    */
    let fetchedSubjects;
    let lastSubject;
    let genSubjectIDVal = "";
    console.log(Subject.find())
    Subject.find()
        .then(subjects => {
            fetchedSubjects = subjects;
            return Subject.countDocuments();
        })
        .then(count => {
            if (fetchedSubjects[count - 1]) {
                lastSubject = fetchedSubjects[count - 1]
            } else {
                lastSubject = { subjectID: "0" }
            }

            let lastSubjectID = lastSubject.subjectID;
            let maxSubjectCount = count;
            let lastSubjectID_num = 0;
            let subjectIDAr = lastSubjectID.split("-");
            for (let i = 0; i < subjectIDAr.length; i++) {
                if (isNumeric(subjectIDAr[i].trim())) {
                    //console.log(subjectIDAr[i]);
                    lastSubjectID_num = Number(subjectIDAr[i].trim());
                    //console.log(lastSubjectID_num);
                    //if(lastSubjectID_num!=0){
                    if (lastSubjectID_num >= maxSubjectCount) {
                        genSubjectIDVal =
                            "MEDREC-" + padLeft(lastSubjectID_num + 1, 5, "0");
                        console.log("last subject id");
                    } else {
                        genSubjectIDVal =
                            "MEDREC-" + padLeft(maxSubjectCount + 1, 5, "0");
                        console.log("max subject");
                    }
                    console.log(genSubjectIDVal);
                    //}
                }
            }
            console.log(genSubjectIDVal);
            let last_Updated_Date = new Date()
            if (isDate(req.body.lastUpdatedDate)) {
                last_Updated_Date = new Date(req.body.lastUpdatedDate)
            }
            const subject = new Subject({
                subjectID: genSubjectIDVal,
                subjectAadhar: req.body.subjectAadhar,
                subjectName: req.body.subjectName,
                subjectDOB: req.body.subjectDOB,
                subjectGender: req.body.subjectGender,
                subjectAddress: req.body.subjectAddress,
                subjectPhoneNo: req.body.subjectPhoneNo,
                subjectEmailID: req.body.subjectEmailID,
                lastUpdatedDate: last_Updated_Date,
                listOfVisits: req.body.listOfVisits,
                creator: req.userData.userId
            });
            console.log(subject);
            subject.save()
                .then(createdItem => {
                    res.status(201).json({
                        message: "Subject added successfully!",
                        subjectId: createdItem._id
                    });
                })
                .catch((error) => {
                    console.log(error)
                    // console.log("Subject NOT saved")
                    res.status(500).json({ message: 'Failed to add Subjects!' })
                });
        })
        .catch((error) => {
            // console.log("Unable to get subjects")
            res.status(500).json({ message: 'Failed to fetch Subject GenID!' })
        });


}


exports.updateSubject = (req, res, next) => {
    // subjectDataArray = [];
    // for(let i=0;i<req.body.listOfItems.length;i++){

    //     subjectDataArray.push({item_id:"", itemName:"", itemCostPrice: 0, itemSellingPrice: 0, item_qty:0, quantity:0, cpCost:0, spCost:0, profit:0 });

    //     subjectDataArray[i].item_id=req.body.listOfItems[i].item_id
    //     subjectDataArray[i].itemName=req.body.listOfItems[i].itemName
    //     subjectDataArray[i].itemCostPrice=req.body.listOfItems[i].itemCostPrice
    //     subjectDataArray[i].itemSellingPrice=req.body.listOfItems[i].itemSellingPrice
    //     subjectDataArray[i].item_qty=req.body.listOfItems[i].item_qty
    //     subjectDataArray[i].quantity=req.body.listOfItems[i].quantity
    //     subjectDataArray[i].quantity_copy=req.body.listOfItems[i].quantity_copy
    //     subjectDataArray[i].cpCost=req.body.listOfItems[i].cpCost
    //     subjectDataArray[i].spCost=req.body.listOfItems[i].spCost
    //     subjectDataArray[i].profit=req.body.listOfItems[i].profit
    //     subjectDataArray[i].itemHSN=req.body.listOfItems[i].itemHSN
    // }
    let last_Updated_Date = new Date()
    if (isDate(req.body.lastUpdatedDate)) {
        last_Updated_Date = new Date(req.body.lastUpdatedDate)
    }
    const subject = new Subject({
        _id: req.body._id,
        subjectID: req.body.subjectID,
        subjectAadhar: req.body.subjectAadhar,
        subjectName: req.body.subjectName,
        subjectDOB: req.body.subjectDOB,
        subjectGender: req.body.subjectGender,
        subjectAddress: req.body.subjectAddress,
        subjectPhoneNo: req.body.subjectPhoneNo,
        subjectEmailID: req.body.subjectEmailID,
        lastUpdatedDate: last_Updated_Date,
        listOfVisits: req.body.listOfVisits,
        creator: req.userData.userId
    })

    Subject.updateOne({ _id: req.params.id, creator: req.userData.userId }, subject)
        .then(result => {
            console.log(result)

            if (result.matchedCount > 0) {
                res.status(200).json({ message: "Subject updated successfully!" });
            } else {
                res.status(401).json({ message: "Not Authorized" })
            }
        })
        .catch((error) => {
            // console.log("Subject not updated")
            res.status(500).json({ message: 'Failed to update Subjects!' })
        })
}

exports.deleteSubject = (req, res, next) => {
    Subject.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then(result => {
            // console.log("onDelete")
            // console.log(result);
            if (result.deletedCount > 0) {
                res.status(200).json({ message: "Subject Deleted successfully!" });
            } else {
                res.status(401).json({ message: "Not Authorized" })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Deleting the Subject failed!' })
        });
}
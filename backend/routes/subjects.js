const express =  require('express');
const router=express.Router();

const SubjectController=require('../controllers/subject');
const checkAuth= require("../middleware/check-auth");

router.get('',SubjectController.getSubjects);
router.get('/search',SubjectController.searchSubject);
router.get('/:id',SubjectController.getSubject);
router.post('',checkAuth,SubjectController.createSubject)
router.put("/:id",checkAuth,SubjectController.updateSubject);
router.delete('/:id',checkAuth,SubjectController.deleteSubject);


module.exports=router;
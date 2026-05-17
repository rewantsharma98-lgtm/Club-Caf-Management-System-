const express = require('express');
const branchController = require('../controllers/branchController');
const { protect } = require('../middleware/auth');
const { businessAdmin } = require('../middleware/rbac');

const router = express.Router();

router.get('/', protect, businessAdmin, branchController.getBranches);
router.post('/', protect, businessAdmin, branchController.createBranch);
router.put('/:id', protect, businessAdmin, branchController.updateBranch);
router.delete('/:id', protect, businessAdmin, branchController.deleteBranch);

module.exports = router;

const { Router } = require('express');
const router = Router({ mergeParams: true });
const { protect } = require('../middlewares/auth');

const {
  register,
  withdrawal,
  getUsers,
  getUser,
  editUser,
  myProfile,
  editMyProfile,
  login,
  logout,
  getRanking,
  getMyRecord
} = require('../controllers/user');


router
  .route('/')
  .post(register)
  .delete(protect, withdrawal)
  .get(getUsers);

router
  .route('/rank/:id')
  .get(getRanking);

router
  .route('/record')
  .get(protect, getMyRecord);

router
  .route('/profile')
  .get(protect, myProfile)
  .put(protect, editMyProfile);

router
  .route('/:id')
  .get(getUser)
  .put(protect, editUser);

router
  .route('/login')
  .post(login);
// router.get("/logout", logout);

module.exports = router;

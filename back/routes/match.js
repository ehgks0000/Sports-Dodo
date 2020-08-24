const { Router } = require('express');
const router = Router({ mergeParams: true });
const {
    createMatch,
    getMatch,
    getMatchs,
    editMatch,
    deleteMatch
} = require('../controllers/match');

const Match = require('../models/Match');

const advancedResults = require('../middlewares/advancedResults');

// Include other resource routers
const battingRouter = require('./batting');
// Re-route into other resource routers
router.use('/:id/batting', battingRouter);

router
    .route("/")
    .post(createMatch)
    .get(advancedResults(Match), getMatchs);

router
    .route("/:id")
    .get(getMatch)
    .put(editMatch)
    .delete(deleteMatch);

module.exports = router;


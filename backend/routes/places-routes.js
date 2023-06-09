const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const HttpError = require("../models/http-error");
const placesControllers = require("../controllers/places-controller");

router.get("/:pid", placesControllers.getPlaceById);
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), 
  check("description").isLength({ min: 5 })
],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

module.exports = router;

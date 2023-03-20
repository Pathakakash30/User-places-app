const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../ultis/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById({ _id: placeId });
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }

  if (!place) {
    return next(new HttpError("Could not find place for provided id.", 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(new HttpError("Could not find place for provided id.", 404));
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

//@dec Create new place
//@pathapi/places
//@ login user
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed please check your data", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  //api key is disabled so hard code it
  // try {
  //   coordinates = await getCoordsForAddress(address);
  //   console.log(coordinates);
  // } catch (error) {
  //   next(error);
  // }
  coordinates = { lat: 30, lng: 50 };

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png",
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("something went wrong in verifying user", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Can not verify user", 404);
    return next(error);
  }

  

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }

  res.status(201).json(createdPlace);
};

//@dec update place
//@pathapi/places/id
//@ login user
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input passed please check your data", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(
      new HttpError("Something went wrong , could not delete place.", 500)
    );
  }

  if (!place) {
    return next(new HttpError("Place doent exist", 404));
  }
  

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Place.deleteOne({ _id: placeId }, { session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  res.status(200).json({ message: "Deleted Place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

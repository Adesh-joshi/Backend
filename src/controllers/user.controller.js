import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  //get user detail from frontend
  //validation - not empty, check if user already exist - email, username
  //check for images , check for avatar
  //upload them to cloudinary
  //create user object - create entry in db
  //remove password and refesh token from response
  // check for user creation
  //return res


  const { fullName, email, username, password } = req.body
  console.log("email", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "User already exist")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatarare required")
  }

  //upload to cloudinary

  const avatar =  await uploadOnCloudinary(avatarLocalPath)
  const coverImage =  await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar ) {
    throw new ApiError(400, "Failed to avatar upload image")
  }

   const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url||""
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, " Something went wrong Failed to create user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )

});

export { registerUser };
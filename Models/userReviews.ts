import mongoose from "mongoose";
import { Movies } from "./movies";

function stringToBoolean(value: string) {
    return value == 'True'? true: false;
}

const userReviewsSchema = new mongoose.Schema({
  
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: Movies
    },
    rating: {
        type: Number,
        required: true,
        enum: [ 4.5, 4.0, 3.0, 5.0, 3.5, 1.5, 2.5, 2.0, 1.0, 0.5 ]
    },
    reviewId: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        required: true,
        set: stringToBoolean
    },
    isSuperReviewer: {
        type: Boolean,
        required: true,
        set: stringToBoolean
    },
    hasSpoilers: {
        type: Boolean,
        required: true,
        set: stringToBoolean
    },
    hasProfanity: {
        type: Boolean,
        required: true,
        set: stringToBoolean        
    },
    score: {
        type: Number,
        required: true,
        enum: [ 4.5, 4.0, 3.0, 5.0, 3.5, 1.5, 2.5, 2.0, 1.0, 0.5 ]
    },
    creationDate: {
        type: Date,
        required: true
    },
    userDisplayName: {
        type: String,     
    },
    userRealm: {
        type: String,
        required: true,
        enum: [ 'RT', 'Flixster', 'Fandango' ]        
    },
    userId: {
        type: String,
        required: true
    }

    
})

export const UserReviews = mongoose.model('UserReview', userReviewsSchema);


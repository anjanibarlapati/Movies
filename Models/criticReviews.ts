import mongoose from 'mongoose';
import { Movies } from './movies';

enum reviewState {
    Fresh = "fresh",
    Rotten = "rotten"
}

var grades: {[key: string]: number} = {
     'A+': 100,
     'A': 95,
     'A-': 90,
     'B+': 85,
     'B': 80,
     'B-': 75,
     'C+': 70,
     'C': 65,
     'C-': 60,
};

// Normailising originalScore to a linear range of 0 to 100
function linearOriginalScore(score: string): number | null {

    if (!score || score.trim() === '') return null;

    else if(score === 'FIVE STARS')
        return 100;

    else if(score === '+3 out of -4..+4') {
        return ((3 - (-4)) / (4 - (-4))) * 100;
    }

    else if(grades[score.trim()]) {
        return grades[score.trim()];
    }

    else if(/^\d+\/\d+$/.test(score)) {
        const score1 = score.split('/');
        return ((parseInt(score1[0]))/(parseInt(score1[1])))*100;

    }

    else if(/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(score)) {
        const score1= score.split('/').map(parseFloat);
        return (score1[0]/score1[1])*100;
    }
    
    // Score like '5', '10'
    else if(/\d+$/.test(score)) {
        const maxValue =10;
        return (parseInt(score) / maxValue)*100;
    }

    return null;
}


const criticReviewsSchema = new mongoose.Schema({

    reviewId: {
        type: Number,
        required: true,
        unique: true 
    },
    creationDate: {
        type: Date,
        required: true  
    },
    criticName: {
        type: String 
    },
    criticPageUrl: {
        type: String,
        validator: {
            validate: function(value: string) {
                    const urlPattern = /^\/critics\/[a-zA-Z0-9-]+$/;
                    return urlPattern.test(value);
                  },
                  message: 'Invalid URL format for criticPageUrl'
            }   
    },
    reviewState: {
         type: String,
         required: true,
          enum: Object.values(reviewState)     
    },
    isFresh: {
         type: Boolean,
         required: true,
         set: function(value: string) {
              return value === 'True'? true: false;
         }     
    },
    isRotten: {
        type: Boolean,
        required: true,
        set: function(value: string) {
            return value === 'True'? true: false;
        }        
    },
    isRtUrl: {
        type: Boolean,
        //required: true,
        set: function(value: string) {
            if(value == '') return null;
            return value === 'True'? true: false;
        }        
    },
    isTopCritic: {
        type: Boolean,
        required: true,
        set: function(value: string) {
            return value === 'True'? true: false;
        }    
    },
    publicationUrl: {   
        type: String,
        required: true,
        validator: {
            validate: function(value: string){
                const urlPattern = /^\/critics\/source\/\d+$/;
                    return urlPattern.test(value);
            },
            message: 'Invalid URL format for publicationUrl'
        } 
    },
    publicationName: {
        type: String,
        required: true 
    },
    reviewUrl: {
        type: String,
        validator: {
            validate: function(value: string){
                const urlPattern = /^https?:\/\/([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(.*)?$/;
                return urlPattern.test(value);
            },
            message: 'Invalid URL format for reviewUrl'
        } 
    },
    // quote: {
    //     type: String 
    // },
    scoreSentiment: {
        type: String,
        required: true,
        enum: ['POSITIVE', 'NEGATIVE']  
    },
    originalScore: {
        type: Number,
        set: linearOriginalScore,
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: Movies  
    }

});
export const CriticReviews = mongoose.model('CriticReview', criticReviewsSchema);

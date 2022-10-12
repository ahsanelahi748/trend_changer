import mongoose from 'mongoose';
import { getTimeStamp } from '../../common';

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    companyId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Number,
        required: true,
        default: getTimeStamp
    }
});

const CompanyFollower = mongoose.model("companyFollowers", schema);

export { CompanyFollower };
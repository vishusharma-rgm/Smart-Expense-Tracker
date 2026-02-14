// import mongoose from 'mongoose';

// const budgetSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       unique: true   // one active budget per user
//     },
//     monthlyLimit: {
//       type: Number,
//       required: true
//     },
//     categoryLimits: {
//       type: Map,
//       of: Number,   // { Food: 5000, Travel: 3000 }
//       default: {}
//     }
//   },
//   { timestamps: true }
// );

// const Budget = mongoose.model('Budget', budgetSchema);
// export default Budget;
import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  month: Number,
  year: Number,
  limit: {
    type: Number,
    default: 0
  },
  carriedOver: {
    type: Number,
    default: 0
  },
  rolloverEnabled: {
    type: Boolean,
    default: true
  },
  categoryLimits: {
    type: Map,
    of: Number,
    default: {}
  },
  history: [
    {
      date: { type: Date, default: Date.now },
      limit: Number,
      carriedOver: Number,
      rolloverEnabled: Boolean,
      categoryLimits: {
        type: Map,
        of: Number,
        default: {}
      }
    }
  ]
});

export default mongoose.model("Budget", budgetSchema);

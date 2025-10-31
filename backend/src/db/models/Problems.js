import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema({
  problem_id: String,
  title: String,
  url: String,
  statement: {
    description: String,
    input_format: String,
    output_format: String
  },
  examples: []
}, { timestamps: true });

// 👇 Force it to use the 'questions' collection
export default mongoose.models.Problem || mongoose.model("Problem", ProblemSchema, "questions");
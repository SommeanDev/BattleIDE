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
  // optional fields your saved documents have...
}, { timestamps: true });

export default mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);
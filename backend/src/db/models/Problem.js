import mongoose from "mongoose";

const TestCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true,
    },
    output: {
        type: String,
        required: true,
    },
    _id: false
});

const ProblemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    statement: {
        description: String,
        input_format: String,
        output_format: String,
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium",
    },
    examples: [TestCaseSchema],

    testCases: [TestCaseSchema],

}, {
    timestamps: true,
    collection: "questions"
});

export default mongoose.models.Problem || mongoose.model("Problem", ProblemSchema, "questions");


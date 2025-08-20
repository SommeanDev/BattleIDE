import express from "express";
const router = express.Router();

const sampleProblem = {
  id: "sum-two",
  title: "Sum of Two Integers",
  description: "Read two integers from stdin and print their sum.",
  input: "2 3",
  output: "5",
  template: {
    javascript: `// read two ints from stdin and print their sum\nprocess.stdin.on('data', data => {\n  const [a, b] = data.toString().trim().split(/\\s+/).map(Number);\n  console.log(a + b);\n});`,
    python: `# read two ints from stdin and print their sum\nprint(sum(map(int, input().split())))`,
  },
};

router.get("/", (req, res) => {
  res.json(sampleProblem);
});

export default router;

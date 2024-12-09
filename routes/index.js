const express = require("express");
const router = express.Router();
const DecisionTree = require("decision-tree");
const loadData = require("../utils/dataLoader");

let features = [
    "radius_mean",
    "texture_mean",
    "perimeter_mean",
    "area_mean",
    "smoothness_mean",
    "compactness_mean",
    "concavity_mean",
    "concave_points_mean",
];

// Split the dataset into training and testing sets
const splitData = (data, trainSize = 0.8) => {
    const shuffledData = [...data];
    shuffledData.sort(() => Math.random() - 0.5); // Random shuffle
    const trainDataSize = Math.floor(shuffledData.length * trainSize);
    const trainData = shuffledData.slice(0, trainDataSize);
    const testData = shuffledData.slice(trainDataSize);
    return { trainData, testData };
};

// Home route
router.get("/", (req, res) => {
    res.render("index", { features, result: null, precision: null });
});

// Prediction API
router.post("/predict", (req, res) => {
    loadData("./data/cancer.csv")
        .then((data) => {
            const target = "diagnosis"; // "M" for malignant, "B" for benign
            if (!data || data.length === 0) {
                throw new Error("No data available for training");
            }

            const { trainData, testData } = splitData(data);

            // Train a new Decision Tree model for every prediction request
            const dt = new DecisionTree(trainData, target, features);
            console.log("Decision Tree trained successfully!");

            // Evaluate the model's precision on the test set
            const precision = dt.evaluate(testData);
            console.log("Model precision:", precision);

            // Validate inputs and parse them
            const input = {
                radius_mean: parseFloat(req.body.radius_mean),
                texture_mean: parseFloat(req.body.texture_mean),
                perimeter_mean: parseFloat(req.body.perimeter_mean),
                area_mean: parseFloat(req.body.area_mean),
                smoothness_mean: parseFloat(req.body.smoothness_mean),
                compactness_mean: parseFloat(req.body.compactness_mean),
                concavity_mean: parseFloat(req.body.concavity_mean),
                concave_points_mean: parseFloat(req.body.concave_points_mean),
            };

            // Make the prediction
            const prediction = dt.predict(input);
            res.render("index", {
                features,
                result: `The diagnosis is: ${prediction === "M" ? "Malignant" : "Benign"}`,
                precision: precision.toFixed(2),
            });
        })
        .catch((err) => {
            console.error("Error loading or training model:", err);
            res.render("index", { features, result: "Error loading or training model.", precision: null });
        });
});

module.exports = router;

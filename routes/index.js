const express = require("express");
const router = express.Router();
const DecisionTree = require("decision-tree");
const fs = require("fs");
const path = require("path");

// Features used for the decision tree
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

let featureLabels = [
    "Radius Mean",
    "Texture Mean",
    "Perimeter Mean",
    "Area Mean",
    "Smoothness Mean",
    "Compactness Mean",
    "Concavity Mean",
    "Concave Points Mean",
];

// Load the trained model
const modelPath = path.resolve(process.cwd(), "./models/0.860.json");
let dt;

try {
    const modelData = JSON.parse(fs.readFileSync(modelPath, "utf8"));
    dt = new DecisionTree(modelData);
} catch (err) {
    console.error("Error loading the decision tree model:", err.message);
}

// Home route
router.get("/", (req, res) => {
    res.render("index", { features, featureLabels, result: null, danger: null });
});

// Prediction route
router.post("/predict", (req, res) => {
    try {
        const input = {};
        features.forEach((feature) => {
            input[feature] = parseFloat(req.body[feature]);
        });

        // Make the prediction
        const prediction = dt.predict(input);
        res.render("index", {
            features,
            featureLabels,
            result: `The diagnosis is: ${prediction === "M" ? "Malignant" : "Benign"}`,
            danger: prediction === "M",
        });
    } catch (error) {
        console.error("Error making prediction:", error.message);
        res.render("index", { features, featureLabels, result: "Error making prediction.", danger: null });
    }
});

module.exports = router;

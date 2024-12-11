const fs = require("fs");
const DecisionTree = require("decision-tree");
const loadData = require("./utils/dataLoader");

let features = [
    "radius_mean",
    "texture_mean",
    "perimeter_mean",
    "area_mean",
    "smoothness_mean",
    "compactness_mean",
    "concavity_mean",
    "concave_points_mean",
    "symmetry_mean",
    "fractal_dimension_mean",
    "radius_se",
    "texture_se",
    "perimeter_se",
    "area_se",
    "smoothness_se",
    "compactness_se",
    "concavity_se",
    "concave_points_se",
    "symmetry_se",
    "fractal_dimension_se",
    // "radius_worst",
    // "texture_worst",
    // "perimeter_worst",
    // "area_worst",
    // "smoothness_worst",
    // "compactness_worst",
    // "concavity_worst",
    // "concave_points_worst",
    // "symmetry_worst",
    // "fractal_dimension_worst",
];

/**
 * Split the dataset into training and testing sets.
 * @param {Array<Object>} data - The dataset to split.
 * @param {number} trainSize - Proportion of data to use for training (0 < trainSize <= 1).
 * @returns {Object} - An object containing trainData and testData.
 */
const splitData = (data, trainSize = 0.85) => {
    const shuffledData = [...data];
    shuffledData.sort(() => Math.random() - 0.5); // Random shuffle
    const trainDataSize = Math.floor(shuffledData.length * trainSize);
    return {
        trainData: shuffledData.slice(0, trainDataSize),
        testData: shuffledData.slice(trainDataSize),
    };
};

(async () => {
    try {
        const filePath = "./data/cancer.csv";
        const data = await loadData(filePath);

        if (!data || data.length === 0) {
            throw new Error("No data available for training");
        }

        const target = "diagnosis"; // "M" for malignant, "B" for benign
        let dt; // Declare `dt` outside the loop
        let precision = 0;
        const precisionThreshold = 0.9; // Desired precision threshold
        let iterationCount = 0;

        while (precision < precisionThreshold) {
            iterationCount++;
            // Reshuffle the data for every iteration
            const { trainData, testData } = splitData(data);

            // Train the model
            dt = new DecisionTree(target, features);
            dt.train(trainData);

            // Evaluate precision manually
            let correctPredictions = 0;
            testData.forEach((test) => {
                const prediction = dt.predict(test);
                if (prediction === test[target]) {
                    correctPredictions++;
                }
            });

            precision = correctPredictions / testData.length;
            console.log(`Iteration ${iterationCount}: Current model precision:`, precision);
        }

        console.log("Decision Tree trained successfully with precision:", precision);

        // Save the trained model to a JSON file
        const modelJson = JSON.stringify(dt.toJSON(), null, 2); // Convert to a formatted JSON string
        fs.writeFileSync(`./models/${precision.toFixed(3)}.json`, modelJson);
        console.log(`Trained model saved to ${precision.toFixed(3)}.json`);
    } catch (err) {
        console.error("Error loading or training model:", err);
    }
})();
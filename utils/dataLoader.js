const fs = require("fs");
const csv = require("csv-parser");

const loadData = (filePath) => {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                // Process and keep relevant fields
                data.push({
                    radius_mean: parseFloat(row.radius_mean),
                    texture_mean: parseFloat(row.texture_mean),
                    perimeter_mean: parseFloat(row.perimeter_mean),
                    area_mean: parseFloat(row.area_mean),
                    smoothness_mean: parseFloat(row.smoothness_mean),
                    compactness_mean: parseFloat(row.compactness_mean),
                    concavity_mean: parseFloat(row.concavity_mean),
                    concave_points_mean: parseFloat(row.concave_points_mean),
                    symmetry_mean: parseFloat(row.symmetry_mean),
                    fractal_dimension_mean: parseFloat(row.fractal_dimension_mean),
                    radius_se: parseFloat(row.radius_se),
                    texture_se: parseFloat(row.texture_se),
                    perimeter_se: parseFloat(row.perimeter_se),
                    area_se: parseFloat(row.area_se),
                    smoothness_se: parseFloat(row.smoothness_se),
                    compactness_se: parseFloat(row.compactness_se),
                    concavity_se: parseFloat(row.concavity_se),
                    concave_points_se: parseFloat(row.concave_points_se),
                    symmetry_se: parseFloat(row.symmetry_se),
                    fractal_dimension_se: parseFloat(row.fractal_dimension_se),
                    // radius_worst: parseFloat(row.radius_worst),
                    // texture_worst: parseFloat(row.texture_worst),
                    // perimeter_worst: parseFloat(row.perimeter_worst),
                    // area_worst: parseFloat(row.area_worst),
                    // smoothness_worst: parseFloat(row.smoothness_worst),
                    // compactness_worst: parseFloat(row.compactness_worst),
                    // concavity_worst: parseFloat(row.concavity_worst),
                    // concave_points_worst: parseFloat(row.concave_points_worst),
                    // symmetry_worst: parseFloat(row.symmetry_worst),
                    // fractal_dimension_worst: parseFloat(row.fractal_dimension_worst),
                    diagnosis: row.diagnosis, // "M" or "B"
                });
            })
            .on("end", () => resolve(data))
            .on("error", (err) => reject(err));
    });
};

module.exports = loadData;

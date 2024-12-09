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
                    diagnosis: row.diagnosis, // "M" or "B"
                });
            })
            .on("end", () => resolve(data))
            .on("error", (err) => reject(err));
    });
};

module.exports = loadData;

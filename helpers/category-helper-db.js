const timeHelper = require("./time.helper");

exports.updateCategoryDB = (category, body) => {
  const { level_id, variant_id, result } = body;

  const updatedCategory = { ...category };
  let pointsDelta = 0;

  let nextI = null; // next level
  let nextJ = null; // next variant
  updatedCategory.levels.forEach((level, i) => {
    if (i === nextI && result >= 80) {
      level.enabled = true;
      level.variants[0].enabled = true;
    }

    if (level.level_id === level_id) {
      nextI = i + 1;

      level.variants.forEach((v, j) => {
        if (j === nextJ && result >= 80) {
          v.enabled = true;
        }

        if (v.variant_id === variant_id) {
          const previousResultTimeAdjusted = getPreviousTimeAdjustedResult(v, j);
          pointsDelta = result - previousResultTimeAdjusted;
          v.previousResult = previousResultTimeAdjusted;
          v.result = result;
          v.date = timeHelper.getDate();
          nextJ = j + 1;
        }
      });
    }
  });

  return [updatedCategory, pointsDelta];
}


function getPreviousTimeAdjustedResult(variant, j) {
  if (!variant.date) {
    return variant.result;
  }

  const differenceDays = timeHelper.getDateDifference(variant.date);
  if (!differenceDays) {
    return variant.result;
  }

  const resultSetback = Math.floor(differenceDays * (j + 1));
  const timeAdjustedResult = variant.result - resultSetback;
  return timeAdjustedResult < 0 ? 0 : timeAdjustedResult;
}

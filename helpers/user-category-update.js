exports.updateUserCategory = (category, body) => {
  const { level_id, variant_id, result, date } = body;

  const updatedCategory = {...category};
  let pointsDelta = 0;

  let nextI = null; // next level
  let nextJ = null; // next variant
  updatedCategory.levels.forEach((l, i) => {
    if (i === nextI && result >= 80) {
      l.enabled = true;
      l.variants[0].enabled = true;
    }

    if (l.level_id === level_id) {
      nextI = i + 1;

      l.variants.forEach((v, j) => {
        if (j === nextJ && result >= 80) {
          v.enabled = true;
        }

        if (v.variant_id === variant_id) {

          const previousPointsTimeUpdated = updateVariantTime(v, j);
          pointsDelta = result - previousPointsTimeUpdated;
          v.result = result;
          v.date = date;
          nextJ = j + 1;
        }

      });
    }
  });

  return [updatedCategory, pointsDelta];
}


function updateVariantTime(variant, j) {

  if (!variant.date) {
    return variant.result;
  }

  const differenceDays = getDateDifference(variant.date);

  if (!differenceDays) {
    return variant.result;
  }

  const resultWithdrawal = Math.floor(differenceDays / (j + 1));

  if (!resultWithdrawal) {
    return variant.result;
  }

  const result = variant.result - resultWithdrawal;
  return result < 0 ? 0 : result;
}

const msInDay = 86400000; // 1000 * 60 * 60 * 24

function getDate(){
  const date = new Date();
  const year = date.getFullYear();
  const m = date.getMonth() + 1;
  const month = String(m).length === 1 ? `0${m}` : m;
  const d = date.getDate();
  const day = String(d).length === 1 ? `0${d}` : d;

  // console.log(`${year}-${month}-${day}`);
  const currentDate = new Date(`${year}-${month}-${day}`);
  return currentDate.getTime() / msInDay;
}

// difference in full days
function getDateDifference(date){
  const currentDate = getDate();
  return (date - currentDate);
}

exports.updateUserCategory = (category, body) => {
  const { level_id, variant_id, result } = body;

  const updatedCategory = {...category};

  let nextI = null; // next level
  let nextJ = null; // next variant
  updatedCategory.levels.forEach((l, i) => {
    if (i === nextI && result > 60) {
      l.enabled = true;
      l.variants[0].enabled = true;
    }

    if (l.level_id === level_id) {
      nextI = i + 1;

      l.variants.forEach((v, j) => {
        if (j === nextJ && result > 60) {
          v.enabled = true;
        }

        if (v.variant_id === variant_id) {
          v.result = result;
          nextJ = j + 1;
        }

      });
    }
  });

  return updatedCategory;
}

const timeHelper = require("./time.helper");

exports.adjustCategory = (category) => {

    const levels = category.levels.map((level) => {
        const adjustedVariants = [];
        let variantsEnabled = true;

        level.variants.forEach((v, j) => {
            const differenceDays = timeHelper.getDateDifference(v.date);
            if (!differenceDays) {
                adjustedVariants.push(v); return;
            }

            const resultSetback = Math.floor(differenceDays * (j + 1));
            const timeAdjustedResult = v.result - resultSetback;
            const result = timeAdjustedResult < 0 ? 0 : timeAdjustedResult;

            if (j > 0 && (!adjustedVariants[j - 1].enabled || adjustedVariants[j - 1].result < 80)) {
                variantsEnabled = false;
            }

            const adjustedVariant = {
                ...v,
                result,
                enabled: variantsEnabled,
            }

            adjustedVariants.push(adjustedVariant);
        });

        return {
            ...level,
            variants: adjustedVariants
        };
    });

    return {
        ...category,
        levels
    };
}

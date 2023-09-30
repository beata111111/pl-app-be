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


exports.updateCategories = (categories) => {

    return categories.map(cat => {
        const levels = cat.levels.map((lev, i) => {
            const updatedVariants = [];
            let variantsEnabled = true;

            lev.variants.forEach((v, j) => {
                if (!v.result) {
                    updatedVariants.push(v);
                    return v;
                }

                const differenceDays = getDateDifference(v.date);

                if (!differenceDays) {
                    updatedVariants.push(v);
                    return;
                }

                const resultWithdrawal = Math.floor(differenceDays / (j + 1));

                if (!resultWithdrawal) {
                    updatedVariants.push(v);
                    return;
                }

                if (j > 0) {
                    if (!updatedVariants[j - 1].enabled || updatedVariants[j - 1].timeAdjustedResult < 80) {
                        variantsEnabled = false;
                    }
                }

                const timeAdjustedResult = v.result - resultWithdrawal;

                const result = {
                    ...v,
                    timeAdjustedResult: timeAdjustedResult < 0 ? 0 : result,
                    enabled: variantsEnabled,
                }
                updatedVariants.push(result);
            });

            return {
                ...lev,
                variants: updatedVariants
            };
        });

        return {
            ...cat,
            levels
        }
    });
}

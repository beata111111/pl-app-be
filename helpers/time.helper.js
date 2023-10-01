const msInDay = 86400000; // 1000 * 60 * 60 * 24

exports.getDate = () => {
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
exports.getDateDifference = (date) => {
    const currentDate = this.getDate();
    return (currentDate - date);
}

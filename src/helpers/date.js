//function for date
function date(){
    const nDate = new Date().getDate();
    const nMonth = new Date().getMonth() + 1;
    const nYear = new Date().getFullYear();
    return `${nDate}/${nMonth}/${nYear}`
}

module.exports={date}
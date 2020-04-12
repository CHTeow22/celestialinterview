const data = require("../public/api/share.json");

const bigStock = formatNum(data && data.shares && data.shares[0]) || 0;
const bigStock2 = (data && data.shares && data.shares[1]) || 0;

const stockData = calcDiff(bigStock, bigStock2);
const stockDelta = checkVal(stockData[0]);
const stockDeltaPercent = checkVal(stockData[1]);

const lastUpdated = (data.updatedDate).toString('dd mm yyyy hh:mm');
const converted = convertDate(lastUpdated);

const totalVal = volCalc();

const indexData = indexCount();
const indexTotal = formatNum(indexData[0]);
const indexDiffCal = calcDiff(indexData[0], indexData[1]);
const indexD = checkVal(indexDiffCal[0]);
const indexDPercent = checkVal(indexDiffCal[1]);


module.exports = {
  bigStock: bigStock,
  stockDelta: stockDelta,
  stockDeltaPercent: stockDeltaPercent,
  volume: totalVal,
  lastUpdated: converted,
  OMXC20: indexTotal,
  OMXC20Diff: indexD,
  OMXC20DiffPercent: indexDPercent
};

function formatNum(n) {
	var nn = parseFloat(n).toFixed(2);
	return nn.toLocaleString();
}
function calcDiff(val, val2) {
	var diff = formatNum(val - val2);
	var percent = formatNum(diff / val2 * 100);
	return [diff, percent];
}

function checkVal(val){
	val = (val > 0) ? ('+ ' + val) : val;
	return val;
}

function volCalc() {
	var total = 0;

	var dateToday = new Date();
	var date6MonthAgo = new Date().setMonth(dateToday.getMonth() - 6);
	var date6MonthUTC = new Date(date6MonthAgo);

	var v = data && data.volumes;
	for (var i = v.length - 1; i >= 0; i--) {
		if( (getDate(v[i].date) <= getDate(dateToday)) && (getDate(v[i].date) >= getDate(date6MonthUTC)) ) {
			total += v[i].volume;
		}
	}
	return total.toLocaleString();
}

function getDate(d) {
	return (new Date(d));
}

function convertDate(d) {
    var date = new Date(d);
    
    var day = date.getDate();
    var month = (date.getMonth() + 1);
    var year = date.getFullYear();

    if (day < 10)
        day = "0" + day;

    if (month < 10)
        month = "0" + month;

    var dateC = day + "." + month + "." + year;

    var hours = date.getHours()
    var minutes = date.getMinutes()

    if (hours < 10)
        hours = "0" + hours;

    if (minutes < 10)
        minutes = "0" + minutes;

    return dateC + " " + hours + ":" + minutes;
}

function indexCount() {
	var t1 = 0;
	var t2 = 0;

	var index1 = data && data.index && data.index[0];
	var index2 = data && data.index && data.index[1];
	 
	for (var i = index1.length - 1; i >= 0; i--) {
		if( index1[i].tags.indexOf('OMXC20') > -1 ) {
			t1 += index1[i].value;
		}
	}

	for (var i = index2.length - 1; i >= 0; i--) {
		if( index2[i].tags.indexOf('OMXC20') > -1 ) {
			t2 += index2[i].value;
		}
	}

	return [t1, t2];
}

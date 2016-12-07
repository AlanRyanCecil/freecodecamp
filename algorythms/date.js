function dateFormat(millis) {
  var dateObj = new Date(millis);
  return dateObj
    .toLocaleDateString("en-us", { month: "long", day: "2-digit", year: "numeric" })
    .replace(/(\d)(\d),/, function (match, tens, ones){
      var ordinal = "th";
      if (tens !== "1") {
        switch (ones) {
          case "1":
            ordinal = "st";
            break;
        case "2":
            ordinal = "nd";
            break;
        case "3":
            ordinal = "rd";
            break;
        }
      }
    
      tens = parseInt(tens) ? tens : "";
      return tens.concat(ones) + ordinal;}).split(' ');
}

function makeFriendlyDates(dArr) {
  
  var today = dateFormat(Date.now()),
    todayMonth = today[0],
    todayDay = today[1],
    todayYear = today[2],
    
    start = dateFormat(Date.parse(dArr[0].replace(/-/g, "/"))),
    startMonth = start[0],
        smNum = dArr[0].match(/-(\d+)-/)[1],
    startDay = start[1],
        sdNum = startDay.match(/\d+/)[0],
    startYear = start[2],
    
    end = dateFormat(Date.parse(dArr[1].replace(/-/g, "/"))),
    endMonth = end[0],
        emNum = dArr[1].match(/-(\d+)-/)[1],
    endDay = end[1],
        edNum = endDay.match(/\d+/)[0],
    endYear = end[2],
        
        track = false,
    
    startResp = [],
    endResp = [];
  
    
  start = start.join(" ");
  end = end.join(" ");
  
  if (start === end) {
    return [start.replace(/(\d{1,2}\w{2})/, "$1,")];
  }
  
  if (startMonth !== todayMonth || startYear !== todayYear) {
    startResp.push(startMonth);
  }
  
  if (endMonth !== startMonth || endYear !== startYear) {
    endResp.push(endMonth);
  }
  
    startResp.push(startDay);
    endResp.push(endDay);
  
  if (startYear !== todayYear || startYear < endYear - 1) {
        var sday = startResp.pop() + ",";
    startResp.push(sday, startYear);
  }
  
    if (startYear < endYear) {
        if (smNum <= emNum && sdNum <= edNum) {
          track = true;
        }
    }
  
  if (endYear - 1 > startYear || track) {
        var eday = endResp.pop() + ",";
    endResp.push(eday, endYear);
  }
  
  startResp = startResp.join(" ");
  endResp = endResp.join(" ");
  
  return [startResp, endResp];
}

makeFriendlyDates(["2016-07-01", "2016-07-04"]);
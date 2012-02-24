$(document).ready(function() {

module('DateTime');

test("DateTime()", function() { 
  strictEqual(new Date().toUTCString(), new DateTime()._d.toUTCString(), 'no argument => current date');
});

test("DateTime(Date)", function() { 
  strictEqual(new DateTime(new Date(2012,0,1))._d.toUTCString(), new Date(2012,0,1).toUTCString(), 'passing Date object as parameter'); 
});

test("DateTime(String in ISO8601 Format)", function() { 
  strictEqual(new DateTime('2012').toUTCString(),       '2012-01-01T00:00:00Z', 'YYYY');
  strictEqual(new DateTime('2012-12').toUTCString(),    '2012-12-01T00:00:00Z', 'YYYY-MM');
  strictEqual(new DateTime('2012-12-31').toUTCString(), '2012-12-31T00:00:00Z', 'YYYY-MM-DD');
  
  strictEqual(new DateTime('2012-12-31T23:59:59Z').toUTCString(), '2012-12-31T23:59:59Z', 'YYYY-MM-DDTHH:MM:SSZ');
  strictEqual(new DateTime('2012-12-31T23:59:59+01:00').toUTCString(), '2012-12-31T22:59:59Z', 'YYYY-MM-DDTHH:MM:SS+HH:MM');
  strictEqual(new DateTime('2012-12-31T23:59:59-01:00').toUTCString(), '2013-01-01T00:59:59Z', 'YYYY-MM-DDTHH:MM:SS-HH:MM');
  
  strictEqual(new DateTime('2012-W01-1').toUTCString(), '2012-01-02T00:00:00Z', 'YYYY-(week)-(day of week #) first week of year');
  strictEqual(new DateTime('2012-W52-7').toUTCString(), '2012-12-30T00:00:00Z', 'YYYY-(week)-(day of week #) last week of year');
  
  strictEqual(new DateTime('2009-W01-1').toUTCString(), '2008-12-29T00:00:00Z', 'YYYY-(week)-(day of week #) first week of year (starts few days before actual year)');
  strictEqual(new DateTime('2009-W53-7').toUTCString(), '2010-01-03T00:00:00Z', 'YYYY-(week)-(day of week #) last week of year (ends few days after actual year)');
  
  var dayCount = 2; // 2012's week starts at Jan 2.
  for(var i = 1; i <= 52; i++) {
    for(var j = 1; j <= 7; j++) {
      var paddedI = (i < 10) ? '0' + i : i + '';
      var d1 = new DateTime('2012-W' + paddedI + '-' + j);
      var d2 = new DateTime.UTC(2012, 1, dayCount);
      strictEqual(d1.toUTCString(), d2.toUTCString(), 'comparing week based input with UTC input. (' + '2012-W' + paddedI + '-' + j + '(' + d1.toUTCString() + ') => ' + d2.toUTCString() + ')');
      dayCount+=1;
    }
  }
});

test("DateTime.now()", function() {
  var d1 = DateTime.now(),
      d2 = new DateTime();
  strictEqual(d1.toUTCString(), d2.toUTCString(), 'comparing new and no args. might error out on slight compational time difference.'); 
});

test("DateTime.UTC()", function() {
  strictEqual(DateTime.UTC(2012,1,1).toUTCString(), '2012-01-01T00:00:00Z', '.UTC(year,month,day)');
  strictEqual(DateTime.UTC(2012,1,1,12).toUTCString(), '2012-01-01T12:00:00Z', '.UTC(year,month,day,hour)'); 
  strictEqual(DateTime.UTC(2012,1,1,12,59).toUTCString(), '2012-01-01T12:59:00Z', '.UTC(year,month,day,hour,min)'); 
  strictEqual(DateTime.UTC(2012,1,1,12,59,59).toUTCString(), '2012-01-01T12:59:59Z', '.UTC(year,month,day,hour,min,sec)'); 
  strictEqual(DateTime.UTC(2012,1,1,12,59,59,999).toUTCString(), '2012-01-01T12:59:59Z', '.UTC(year,month,day,hour,min,sec,msec)'); 
});

test("DateTime.distance()", function() {
  // 0 distance
  var dist = DateTime.distance(new DateTime('2012-01-01'), new DateTime('2012-01-01'));
  strictEqual(dist, 0, "distance is 0");
  
  // can't process milliseconds
  //dist = DateTime.distance(new DateTime('2012-1-1 00:00:00'), new DateTime('2012-1-1 00:00:00.999'));
  //strictEqual(dist, 999, "distance in milliseconds");
  
  // 1 second
  var dist1 = DateTime.distance(new DateTime('2012-01-01T00:00:59Z'), new DateTime('2012-01-01T00:01:00Z'));
  var dist2 = DateTime.distance(new DateTime('2012-01-01T00:01:00Z'), new DateTime('2012-01-01T00:00:59Z'));
  strictEqual(dist1/1000,  1, "distance is +1 second");
  strictEqual(dist2/1000, -1, "distance is -1 second");
  
  // 1 minute
  dist1 = DateTime.distance(new DateTime('2012-01-01T00:59Z'), new DateTime('2012-01-01T01:00Z'));
  dist2 = DateTime.distance(new DateTime('2012-01-01T01:00Z'), new DateTime('2012-01-01T00:59Z'));
  strictEqual(dist1/(1000*60),  1, "distance is +1 minute");
  strictEqual(dist2/(1000*60), -1, "distance is -1 minute");
  
  // 1 hour
  dist1 = DateTime.distance(new DateTime('2012-01-01T00:00Z'), new DateTime('2012-01-01T01:00Z'));
  dist2 = DateTime.distance(new DateTime('2012-01-01T01:00Z'), new DateTime('2012-01-01T00:00Z'));
  strictEqual(dist1/(1000*60*60),  1, "distance is +1 hour");
  strictEqual(dist2/(1000*60*60), -1, "distance is -1 hour");
  
  // 1 day
  dist1 = DateTime.distance(new DateTime('2012-01-01'), new DateTime('2012-01-02'));
  dist2 = DateTime.distance(new DateTime('2012-01-02'), new DateTime('2012-01-01'));
  strictEqual(dist1/(1000*60*60*24),  1, "distance is +1 day");
  strictEqual(dist2/(1000*60*60*24), -1, "distance is -1 day");
  
  // 2 month w/out leap year
  dist1 = DateTime.distance(new DateTime('2011-01-01'), new DateTime('2011-03-01'));
  dist2 = DateTime.distance(new DateTime('2011-03-01'), new DateTime('2011-01-01'));
  strictEqual(dist1/(1000*60*60*24), 59, " 2 months (jan - feb)");
  strictEqual(dist2/(1000*60*60*24),-59, "-2 months (jan - feb)");
  
  // 2 month w/leap year
  dist1 = DateTime.distance(new DateTime('2012-01-01'), new DateTime('2012-03-01'));
  dist2 = DateTime.distance(new DateTime('2012-03-01'), new DateTime('2012-01-01'));
  strictEqual(dist1/(1000*60*60*24), 60, " 2 month(jan - feb) with leap year");
  strictEqual(dist2/(1000*60*60*24),-60, "-2 month(jan - feb) with leap year");
  
  // year
  dist1 = DateTime.distance(new DateTime('2011-01-01'), new DateTime('2012-01-01'));
  dist2 = DateTime.distance(new DateTime('2012-01-01'), new DateTime('2011-01-01'));
  strictEqual(dist1/(1000*60*60*24), 365, "1 year");
  strictEqual(dist2/(1000*60*60*24),-365, "1 year backwards");
  
  // one gives negative number other gives positive
  dist = DateTime.distance(new DateTime('1969-12-31'), new DateTime('1970-01-01'));
  strictEqual(dist/(1000*60*60*24),  1, "distance is +1 day (to is epoch)");
  
  dist = DateTime.distance(new DateTime('1970-01-01'), new DateTime('1969-12-31'));
  strictEqual(dist/(1000*60*60*24), -1, "distance is -1 day (from is epoch");
  
  // both DateTime returns negative number
  dist = DateTime.distance(new DateTime('1969-12-30'), new DateTime('1969-12-31'));
  strictEqual(dist/(1000*60*60*24),  1, "distance is 1 day (from and to is before epoch)");
  
  dist = DateTime.distance(new DateTime('1969-12-31'), new DateTime('1969-12-30'));
  strictEqual(dist/(1000*60*60*24), -1, "distance is -1 days (from and to is before epoch)");
});


test("DateTime.distanceOfTimeInWords()", function() {
  var d = new DateTime(2000,1,1);
  var w = DateTime.distanceOfTimeInWords(d, new DateTime(2000,1,2));
  equal(w, '1 day from now', 'distance of time in words -> ' + w);
  
  w = DateTime.distanceOfTimeInWords(d, new DateTime(2000,1,3));
  equal(w, '2 days from now', 'distance of time in words -> ' + w);
  
  w = DateTime.distanceOfTimeInWords(d, new DateTime(2000,1,31));
  equal(w, 'about 1 month from now', 'distance of time in words -> ' + w);
  
  w = DateTime.distanceOfTimeInWords(d, new DateTime(2000,1,61));
  equal(w, '2 months from now', 'distance of time in words -> ' + w);
  
  w = DateTime.distanceOfTimeInWords(d, new DateTime(2000,1,367));
  equal(w, 'about 1 year from now', 'distance of time in words -> ' + w);
  
  w = DateTime.distanceOfTimeInWords(d, new DateTime(2000,1,366+93));
  equal(w, 'over 1 year from now', 'distance of time in words -> ' + w);
  
  w = DateTime.distanceOfTimeInWords(d, new DateTime(2000,1,366+279));
  equal(w, 'almost 2 years from now', 'distance of time in words -> ' + w);
  
  w = DateTime.distanceOfTimeInWords(d, new DateTime(2300,12,1));
  equal(w, 'almost 301 years from now', 'distance of time in words -> ' + w);
  
  w = DateTime.distanceOfTimeInWords(d, new DateTime(2500,1,1));
  equal(w, 'about 500 years from now', 'distance of time in words -> ' + w);

});


test("DateTime.text", function() { 
  var text = DateTime.i18n['en'];
  ok(typeof(text)==='object', 'Text Labels exists.'); 
  ok((text.wdays instanceof Array) && text.wdays.length===7, 'Labels for day of week exists.'); 
  ok((text.months instanceof Array) && text.months.length===12, 'Labels for month of year exists.'); 
  ok((text.abbrWdays instanceof Array) && text.abbrWdays.length===7, 'Labels for abbreviated day of week exists.'); 
  ok((text.abbrMonths instanceof Array) && text.abbrMonths.length===12, 'Labels for abbreviated month of year exists.'); 
  ok(typeof(text.distanceWords)==='object', 'Labels for distance in words exists.'); 
});

test("time()", function() { 
  var d = DateTime.UTC(1970,1,1);
  strictEqual(d.time(), 0, 'epoch time is at 0 (is based on UTC)'); 
  
  var d1 = DateTime.UTC(2012, 1, 1).time(),
      d2 = Date.UTC(2012, 0, 1);
  strictEqual(d1, d2, 'same value as <Date>.getTime()'); 
});

test("year()", function() { 
  var d = new DateTime(2012,1,1);
  strictEqual(d.year(), 2012, 'Gets local year.'); 
  
  d = new DateTime('2013-01-01T08:59+09:00');
  strictEqual(d.year(), 2013, 'Create 2013-1-1 00:00 +9:00 time and call year(). Checking to see that +9H is applied.'); 
});

test("month()", function() { 
  var d = new DateTime(2012,1,1);
  strictEqual(d.month(),  1, 'Gets local month.'); 
  
  d = new DateTime('2013-01-01T00:00+09:00');
  strictEqual(d.month(),  1, 'Create 2013-1-1 00:00 +9:00 time and call month(). Checking to see that +9H is applied.'); 
});

test("day()", function() { 
  var d = new DateTime(2012,1,1);
  strictEqual(d.day(),  1, 'Gets local day.'); 
  
  d = new DateTime('2013-01-01T00:00+09:00');
  strictEqual(d.day(),  1, 'Create 2013-1-1 00:00 +9:00 time and call day(). Checking to see that +9H is applied.'); 
});

test("hour()", function() { 
  var d = new DateTime(2012,1,1,0,0);
  strictEqual(d.hour(), 0, 'Gets local hour.'); 
  
  d = new DateTime('2013-01-01T00:00+09:00');
  strictEqual(d.hour(), 0, 'Create 2013-1-1 00:00 +9:00 time and call hour(). Checking to see that +9H is applied.'); 
});

test("minute()", function() { 
  var d = new DateTime(2012,1,1,0,0);
  strictEqual(d.minute(), 0, 'Gets local minute.'); 
  
  d = new DateTime(2012,1,1,0,59);
  strictEqual(d.minute(), 59, 'Gets local second preset to 59.'); 
});

test("second()", function() { 
  var d = new DateTime(2012,1,1,0,0,0);
  strictEqual(d.second(), 0, 'Gets local second.'); 
  
  d = new DateTime(2012,1,1,0,0,59);
  strictEqual(d.second(), 59, 'Get second (preset to 59).'); 
});

test("millisecond()", function() { 
  var d = new DateTime(2012,1,1,0,0,0,0);
  strictEqual(d.millisecond(), 0, 'Gets local millisecond.'); 
  
  d = new DateTime(2012,1,1,0,0,0,999);
  strictEqual(d.millisecond(), 999, 'Get millisecond (preset to 999).'); 
});

test("wday()", function() { 
  var d = new DateTime(2012,1,2);
  strictEqual(d.wday(), 1, 'is Monday.'); 
  
  d = new DateTime(2012,1,3);
  strictEqual(d.wday(), 2, 'is Tuesday.'); 
  
  d = new DateTime(2012,1,4);
  strictEqual(d.wday(), 3, 'is Wednesday.'); 
  
  d = new DateTime(2012,1,5);
  strictEqual(d.wday(), 4, 'is Thursday.'); 
  
  d = new DateTime(2012,1,6);
  strictEqual(d.wday(), 5, 'is Friday.'); 
  
  d = new DateTime(2012,1,7);
  strictEqual(d.wday(), 6, 'is Saturday.'); 
  
  d = new DateTime(2012,1,8);
  strictEqual(d.wday(), 7, 'is Sunday.'); 
});

test("utcOffset()", function() { 
  var d1 = new DateTime(2012,1,2),
      d2 = new Date(2012,0,2);
  strictEqual(d1.utcOffset(),-1 * d2.getTimezoneOffset(),'utcOffset is the negated TimeZone offset.');
});

test("isLeap()", function() { 
  var d = new DateTime(2012,1,2);
  ok(d.isLeap(),'2012 is a leap year.');
  
  d = new DateTime(2011,1,2);
  ok(!d.isLeap(),'2011 is NOT a leap year.');
});

test("distanceTo()", function() { 
  var dist = new DateTime(2012,1,1).distanceTo(new DateTime(2012,1,1));
  strictEqual(dist/(1000*60*60*24), 0, 'distance to itself should be 0.');
  
  dist = new DateTime(2012,1,1).distanceTo(new DateTime(2011,12,31));
  strictEqual(dist/(1000*60*60*24),-1, '-1 day.');
  
  dist = new DateTime(2011,12,31).distanceTo(new DateTime(2012,1,1));
  strictEqual(dist/(1000*60*60*24), 1, ' 1 day.');
  
  // same as distance for the most part.
});

test("weekOfYear()", function() { 
  // 2012
  var week = new DateTime(2012,1,1).weekOfYear();
  strictEqual(week, 0, '2012-1-1 is week 0.');
  
  for(var i = 2; i <= 8; i++) {
    week = new DateTime(2012,1,i).weekOfYear();
    strictEqual(week, 1, '2012/01/0'+i+' is week 1.');
  }
  
  week = new DateTime(2012,1,9).weekOfYear();
  strictEqual(week, 2, '2012/01/09 is week 2.');
  
  for(var c = 2, i = 10; i < 365; i+=7, c+=1) {
    d = new DateTime(2012,1,i);
    strictEqual(d.weekOfYear(), c, d.strftime('%F').replace(/-/g,'/')+' is week '+c+'.');
  }
  
  week = new DateTime(2012,12,31).weekOfYear();
  strictEqual(week, 53, '2012-12-31 is week 53 (if counted literally).');
  
  //2011
  week = new DateTime(2011,1,1).weekOfYear();
  strictEqual(week, 0, '2012-1-1 is week 0.');
  
  for(var i = 3; i <= 9; i++) {
    week = new DateTime(2011,1,i).weekOfYear();
    strictEqual(week, 1, '2012/01/0'+i+' is week 1.');
  }
  
  week = new DateTime(2011,1,10).weekOfYear();
  strictEqual(week, 2, '2012/01/09 is week 2.');
    
  week = new DateTime(2011,12,31).weekOfYear();
  strictEqual(week, 52, '2012/12/30 is week 53 (if counted literally).');
});

test("yearWeekDay()", function() { 
  // 2012
  var ywd = new DateTime(2012,1,1).yearWeekDay();
  strictEqual(ywd.year, 2011, '2012-1-1 is week 52 of 2011.');
  strictEqual(ywd.week,   52, '2012-1-1 is week 52.');
  strictEqual(ywd.day,     7, '2012-1-1 is a Sunday.');
  
  ywd = new DateTime(2012,12,31).yearWeekDay();
  strictEqual(ywd.year, 2013, '2012-12-31 is week 1 of 2013(checking year).');
  strictEqual(ywd.week,    1, '2012-12-31 is week 1 of 2013(checking week).');
  strictEqual(ywd.day,     1, '2012-12-31 is a Monday.');
  
  // 2009
  ywd = new DateTime(2009,1,1).yearWeekDay();
  strictEqual(ywd.year, 2009, '2009-1-1 is week 1 of 2009(checking year).');
  strictEqual(ywd.week,    1, '2009-1-1 is week 1 of 2009(checking week).');
  strictEqual(ywd.day,     4, '2009-1-1 is a Thursday.');
  
  ywd = new DateTime(2009,12,31).yearWeekDay();
  strictEqual(ywd.year, 2009, '2009-12-31 is week 53 of 2009(checking year).');
  strictEqual(ywd.week,   53, '2009-12-31 is week 53 of 2009(checking week).');
  strictEqual(ywd.day,     4, '2009-12-31 is a Thursday.');
  
  // 1969
  ywd = new DateTime(1969,1,1).yearWeekDay();
  strictEqual(ywd.year, 1969, '1969-1-1 is week 1 of 1969(checking year).');
  strictEqual(ywd.week,    1, '1969-1-1 is week 1 of 1969(checking week).');
  strictEqual(ywd.day,     3, '1969-1-1 is a Wednesday.');
  
  ywd = new DateTime(1969,12,31).yearWeekDay();
  strictEqual(ywd.year, 1970, '1969-12-31 is week 53 of 2009(checking year).');
  strictEqual(ywd.week,    1, '1969-12-31 is week 53 of 2009(checking week).');
  strictEqual(ywd.day,     3, '1969-12-31 is a Wednesday.');
  
});

test("dayOfYear()", function() { 
  for(var i = 1; i < 366; i++) {
    var d = new DateTime(2012,1,i);
    strictEqual(d.dayOfYear(), i, d.strftime('%F').replace(/-/g,'/') + ' is the ' + i + 'th day of the year.');
  }
  strictEqual(new DateTime(2011,12,31).dayOfYear(), 365, '2011-12-31 is the 365th day of the year.');
  strictEqual(new DateTime(2010,12,31).dayOfYear(), 365, '2010-12-31 is the 365th day of the year.');
  strictEqual(new DateTime(2009,12,31).dayOfYear(), 365, '2009-12-31 is the 365th day of the year.');
  strictEqual(new DateTime(2008,12,31).dayOfYear(), 366, '2008-12-31 is the 366th day of the year.');
});

test("strftime() basic", function() {
  var d = new DateTime(2000,1,2);
  
  // input test
  strictEqual(d.strftime(""),          "",             'Input: blank string.');
  strictEqual(d.strftime("%"),         "%",            'Input: "%" as string.');
  strictEqual(d.strftime("A"),         "A",            'Input: no directive eixsts in string.');
  strictEqual(d.strftime("%!"),        "%!",           'Input: action string that has no definition.');
  strictEqual(d.strftime("%%Y%YA"),    "%Y2000A",      'Input: characters between derective.');
  strictEqual(d.strftime("%Y%Y"),      "20002000",     'Input: same action defined twice.');
  strictEqual(d.strftime("%Y abc"),    "2000 abc",     'Input: string after action.');
  strictEqual(d.strftime("abc %Y"),    "abc 2000",     'Input: string before action.');
  strictEqual(d.strftime("abc %Y abc"),"abc 2000 abc", 'Input: string before and after action.');
  //strictEqual(d.strftime("\0%Y"),      "2000",         'Input: null character before escape.');
});

test("strftime() year", function() {
  var d = new DateTime(2000,1,1);
  strictEqual(d.strftime("%Y"), "2000", '%Y -> year "2000".');
  strictEqual(d.strftime("%C"), "20",   '%C -> "20" century.');
  strictEqual(d.strftime("%y"), "00",   '%y -> "00" (year w/out century).'); // 0 case is handled and is also padded
  
  d = new DateTime(1,1,1);
  strictEqual(d.strftime("%Y"), "1",  '%Y -> year "1".');   // no padding
  strictEqual(d.strftime("%C"), "0", '%C -> "0" century.'); // no padding
  strictEqual(d.strftime("%y"), "01", '%y -> "01" (year w/out century).'); // needs padding
});

test("strftime() month", function() {
  var d = new DateTime(2000,1,2);
  strictEqual(d.strftime("%m"), "01",     '%m -> "01" MM with padding.');  // check padding
  strictEqual(d.strftime("%B"), "January",'%B -> is "January".');
  strictEqual(d.strftime("%b"), "Jan",    '%b -> is "Jan".');
  
  d = new DateTime(2000,12,1);
  strictEqual(d.strftime("%m"), "12",      '%m -> "12" MM with padding.'); // check padding
  strictEqual(d.strftime("%B"), "December",'%B -> is "Decemeber".');       // check text accuracy
  strictEqual(d.strftime("%b"), "Dec",     '%b -> is "Dec".');             // check text accuracy
});

test("strftime() day", function() {
  var d = new DateTime(2000,1,2);
  strictEqual(d.strftime("%d"), "02", '%d -> "02"nd day of the month. (day with padding)');
  strictEqual(d.strftime("%e"), "2",  '%e -> "2"nd day of the month.');
  strictEqual(d.strftime("%j"), "002",'%j prints day of the year.');
  
  d = new DateTime(2012,12,31);
  strictEqual(d.strftime("%d"), "31",  '%d -> "31"st day of the month. (day with padding)');
  strictEqual(d.strftime("%e"), "31",  '%e -> "31"st day of the month.');
  strictEqual(d.strftime("%j"), "366", '%j "366" days in 2012.');
  
  d = new DateTime(2011,12,31);
  strictEqual(d.strftime("%j"), "365", '%j "365" days in 2011.');
});

test("strftime() hour", function() {
  var d = new DateTime(2000,1,1);
  strictEqual(d.strftime("%H"), "00", '%H -> "00" hour.');
  strictEqual(d.strftime("%k"), "0",  '%k -> "0" hour.');
  strictEqual(d.strftime("%I"), "12", '%I -> "12" o\'clock.');
  strictEqual(d.strftime("%l"), "12", '%l -> "12" o\'clock.');
  strictEqual(d.strftime("%P"), "am", '%P -> is "am".');
  strictEqual(d.strftime("%p"), "AM", '%p -> is "AM".');
  
  d = new DateTime(2012,12,31,23,59,59);
  strictEqual(d.strftime("%H"), "23", '%H -> "23" hour.');
  strictEqual(d.strftime("%k"), "23", '%k -> "23" hour.');
  strictEqual(d.strftime("%I"), "11", '%I -> "11" o\'clock.');
  strictEqual(d.strftime("%l"), "11", '%l -> "11" o\'clock.');
  strictEqual(d.strftime("%P"), "pm", '%P -> is "pm".');
  strictEqual(d.strftime("%p"), "PM", '%p -> is "PM".');
});

test("strftime() minutes", function() {
  var d = new DateTime(2000,1,1);
  strictEqual(d.strftime("%M"), "00", '%M -> "00" minutes.');
  
  d = new DateTime(2012,12,31,23,59,59);
  strictEqual(d.strftime("%M"), "59", '%M -> "59" minutes.');  
});

test("strftime() second", function() {
  var d = new DateTime(2000,1,1);
  strictEqual(d.strftime("%S"), "00", '%S -> "00" seconds.');
  
  d = new DateTime(2012,12,31,23,59,59);
  strictEqual(d.strftime("%S"), "59", '%S -> "59" seconds.');  
});

test("strftime() millisecond", function() {
  var d = new DateTime(2000,1,1);
  strictEqual(d.strftime("%L"), "000",'%L -> "000" milliseonds.');
  
  d = new DateTime(2012,12,31,23,59,59,999);
  strictEqual(d.strftime("%L"), "999",'%L -> "999" milliseonds.');
});

test("strftime() time zone", function() {
  var d = new DateTime(2000,1,1);
  var sym = (Math.floor(d.utcOffset()/60) > 0) ? '+': '-';
  var tzh = d._pad(Math.floor(d.utcOffset()/60));
  var tzm = d._pad(d.utcOffset()%60);
  
  strictEqual(d.strftime("%z"),  sym + tzh +  '' + tzm, '%z -> "' + tzh +  '' + tzm + '".');
  strictEqual(d.strftime("%:z"), sym + tzh + ':' + tzm, '%:z -> "'+ tzh + ':' + tzm + '".');
  
  ok(d.strftime("%Z"), '%Z -> some strings. Its not always 3 chars. ex: japanese %Z -> "東京 (標準時)"')
});

test("strftime() day of week", function() {
  var d = new DateTime(2000,1,1);
  strictEqual(d.strftime("%A"), "Saturday", '%A -> "Saturday".');
  strictEqual(d.strftime("%a"), "Sat",    '%a -> "Sat".');
  strictEqual(d.strftime("%u"), "6",      '%u -> "6"th day of the week .'); // check that Sunday is 7.
  
  d = new DateTime(2000,1,3);
  strictEqual(d.strftime("%A"), "Monday", '%A -> "Monday".'); // checking day of week changed 
  strictEqual(d.strftime("%a"), "Mon",    '%a -> "Mon".');
  strictEqual(d.strftime("%u"), "1",      '%u -> "1"st day of the week .'); // check that Monday is 1.
  
  d = new DateTime(2000,1,10);
  strictEqual(d.strftime("%u"), "1",      '%u -> "1"st day of the week .'); // check that Monday is not 8.
});

test("strftime() ISO8601 week based year", function() {
  // week 1 of this year
  var d = new DateTime(2012,1,2);
  strictEqual(d.strftime("%G"), "2012", '%G -> "2012" ISO8601\'s week based year.');
  strictEqual(d.strftime("%g"), "12",   '%g -> "12" last 2 digits of ISO8601\'s week based year');
  strictEqual(d.strftime("%V"), "01",   '%V -> "1" ISO8601\'s week of year');
  
  // week 1 of next year
  var d = new DateTime(2012,12,31);
  strictEqual(d.strftime("%G"), "2013", '%G -> "1999" ISO8601\'s week based year.');
  strictEqual(d.strftime("%g"), "13",   '%g -> "99" last 2 digits of ISO8601\'s week based year');
  strictEqual(d.strftime("%V"), "01",   '%V -> "52" ISO8601\'s week of year');
  
  // week 52 of last year
  var d = new DateTime(2000,1,1);
  strictEqual(d.strftime("%G"), "1999", '%G -> "1999" ISO8601\'s week based year.');
  strictEqual(d.strftime("%g"), "99",   '%g -> "99" last 2 digits of ISO8601\'s week based year');
  strictEqual(d.strftime("%V"), "52",   '%V -> "52" ISO8601\'s week of year');
  
  // week 53 of last year
  d = new DateTime(2010,1,1);
  strictEqual(d.strftime("%G"), "2009", '%G -> "2009" ISO8601\'s week based year.');
  strictEqual(d.strftime("%g"), "09",   '%g -> "09" last 2 digits of ISO8601\'s week based year');
  strictEqual(d.strftime("%V"), "53",   '%V -> "52" ISO8601\'s week of year');
});

test("strftime() week based year", function() {
  strictEqual(new DateTime(2012, 1, 2).strftime("%W"), "01", '%W -> "01"st week of year'); // week  1 of this year
  strictEqual(new DateTime(2012,12,31).strftime("%W"), "53", '%W -> "53"rd week of year'); // week  1 of next year
  strictEqual(new DateTime(2012, 1, 1).strftime("%W"), "00", '%W -> "00"th week of year'); // week 52 of last year
  strictEqual(new DateTime(2010, 1, 1).strftime("%W"), "00", '%W -> "00"th week of year'); // week 53 of last year
});

test("strftime() seconds since epoch", function() {
  var d = new DateTime(2012,1,1);
  var sec =  Math.floor(d.time()/1000);
  strictEqual(d.strftime("%s"), sec + '', '%s -> "' + sec + '" seconds since epoch.');
  
  d = new DateTime.UTC(1970,1,1,0,0,0);
  strictEqual(d.strftime("%s"), "0", '%s -> "0" seconds since epoch.');
});

test("strftime() literal strings", function() {
  var d = new DateTime(2012,1,1);
  
  strictEqual(d.strftime(" t"),  " t",  'nothing');
  strictEqual(d.strftime("%t"),  "\t",  '%t ->  tab');
  strictEqual(d.strftime("%%t"), "%t", '%%t ->  literal "%t"');

  strictEqual(d.strftime(" n"),  " n",  'nothing');
  strictEqual(d.strftime("%n"),  "\n",  '%n ->  new line');
  strictEqual(d.strftime("%%n"), "%n", '%%n ->  literal "%n"');
  
  strictEqual(d.strftime("%")    , '%'    , '% ->  literal "%"');
  strictEqual(d.strftime("%%")   , '%'    , '%% ->  literal "%"');
  strictEqual(d.strftime(" %% ") , ' % '  , '" %% " ->  " % "');
  strictEqual(d.strftime("%% %") , '% %'  , '%% % ->  "% %"');
  strictEqual(d.strftime(" %%%") , ' %%'  , '% %% ->  " %%"');
  strictEqual(d.strftime("%%%%") , '%%'   , '%%%% ->  literal "%" * 2');
  strictEqual(d.strftime("% % %"), '% % %', '% % % ->  as is');
});

test("strftime() Combinations", function() {
  var d = new DateTime(2012,1,1);
  strictEqual(d.strftime("%c"), d.strftime('%a %b %e %T %Y'), '%c -> %a %b %e %T %Y');
  strictEqual(d.strftime("%D"), d.strftime('%m/%d/%y'),       '%D -> %m/%d/%y');
  strictEqual(d.strftime("%F"), d.strftime('%Y-%m-%d'),       '%F -> %Y-%m-%d');
  strictEqual(d.strftime("%r"), d.strftime('%I:%M:%S %p'),    '%r -> %I:%M:%S %p');
  strictEqual(d.strftime("%R"), d.strftime('%H:%M'),          '%R -> %H:%M');
  strictEqual(d.strftime("%T"), d.strftime('%H:%M:%S'),       '%T -> %H:%M:%S');
});

test("toDate()", function() { 
  var dt = new DateTime();
  ok(dt.toDate() instanceof Date, 'toDate returns a Date instanace.');
  strictEqual(dt._d.getTime(), dt.toDate().getTime(), 'toDate is the copy of DateTime\'s internal date variable.');
});

test("toUTCObject()", function() {
  var d = DateTime.UTC(2012,12,31,23,59,59),
      o = d.toUTCObject();
  
  ok(typeof(d)==='object', 'UTC object exists');
  strictEqual(o.time, d.time(), 'Checking attribute => time');
  strictEqual(o.year + '-' + o.month + '-' + o.day + 'T' + o.hour + ':' + o.minute + ':' + o.second + 'Z', 
              d.toUTCString(), 
              'Checking attributes [year, month, day, hour, minute, second]');
  strictEqual(o.wday, 1, 'Checking attribute => wday');
  strictEqual(o.millisecond, 0, 'Checking attribute => millisecond');
  strictEqual(o.dayOfYear, d.dayOfYear(), 'Checking attribute => dayOfYear');
  strictEqual(o.utcOffset, 0, 'Checking attribute => utcOffset');
});

test("toObject()", function() {
  var d = new DateTime(2012,12,31,23,59,59),
      o = d.toObject();
  
  ok(typeof(d)==='object', 'object exists');
  strictEqual(o.time, d.time(), 'Checking attribute => time');
  strictEqual(o.year   + '-' + o.month   + '-' + o.day   + 'T' + o.hour   + ':' + o.minute   + ':' + o.second, 
              d.year() + '-' + d.month() + '-' + d.day() + 'T' + d.hour() + ':' + d.minute() + ':' + d.second(), 
              'Checking attributes [year, month, day, hour, minute, second]');
  strictEqual(o.wday, 1, 'Checking attribute => wday');
  strictEqual(o.millisecond, 0, 'Checking attribute => millisecond');
  strictEqual(o.dayOfYear, d.dayOfYear(), 'Checking attribute => dayOfYear');
  strictEqual(o.utcOffset, d.utcOffset(), 'Checking attribute => utcOffset');
});

test("toUTCString()", function() {
  var d = DateTime.UTC(2012,1,1,23,59,59);
  strictEqual(d.toUTCString(),'2012-01-01T23:59:59Z', 'UTC input to UTC output');
  
  d = new DateTime('2012-01-01T09:00+09:00');
  strictEqual(d.toUTCString(),'2012-01-01T00:00:00Z', 'from non UTC input to UTC output');
});

test("toString()", function() {
  var d = new DateTime(2012,1,1,23,59,59);
  ok((/^(2012-01-01T23:59:59[+-]\d{2}:\d{2})$/).test(d.toString()));
});

});
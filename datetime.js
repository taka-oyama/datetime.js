/**
name:    datetime.js
author:  Taka Oyama
version: 0.1

MIT License 

*/

(function(global){

var DT = global.DateTime = function() {
  var a = arguments;
  
  // if given a Date instance, just set it to _d.
  if(a[0] instanceof Date) {
    this._d = a[0];
  }
  
  // parsing a date formatted string (stored as local time unless time zone is defined)
  // checks if string is in ISO8601 format and convert it (IE[678] doesn't understand ISO8601)
  else if(typeof(a[0])==='string') {
      
    if((/^\d{4}$/).test(a[0])) {
      this._d = new Date(Date.UTC(parseInt(a[0],10),0,1));
    }
    
    else if((/^\d{4}-\d{2}$/).test(a[0])) {
      var arr = a[0].split('-');
      for(var i = 0; i < arr.length; i++) { arr[i] = parseInt(arr[i],10); }
      this._d = new Date(Date.UTC(arr[0],arr[1]-1,1));
    }
    
    else if((/^\d{4}-\d{2}-\d{2}$/).test(a[0])) {
      var arr = a[0].split('-');
      for(var i = 0; i < arr.length; i++) { arr[i] = parseInt(arr[i],10); }
      this._d = new Date(Date.UTC(arr[0],arr[1]-1,arr[2]));
    }
    
    // ISO 8601 - Date with time and time zone
    else if((/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|([+-]\d{2}(:?\d{2}?)?))$/).test(a[0])) {
      a[0] = a[0].replace(/(\d{4})-(\d{2})-(\d{2})T/,'$1/$2/$3 ')
                 .replace(/([+-])(\d{2}):(\d{2})/, ' $1$2$3')
                 .replace(/Z$/,' +0000');
      this._d = new Date(a[0]);
    }
    
    // ISO 8601 - Date with week number
    else if((/^\d{4}-W\d{2}-\d$/).test(a[0])) {
      var y = parseInt(a[0].substr(0,4),10);
      var w = parseInt(a[0].substr(6,2),10);
      var d = parseInt(a[0].substr(9,1),10);
      var daysOffset = (w - 1) * 7 + d; 
      
      var jan1 = new DT(y,1,1);
      var startingWeek = new Date(Date.UTC(jan1.year(), jan1.month()-1, jan1.day()));
      startingWeek.setDate(1 - (startingWeek.getDay() || 7));
      
      // 0 means jan 1 is counted in previous year's week so adjust starting week.
      if(jan1.weekOfYear()===0) {
        startingWeek.setDate(startingWeek.getDate() + 7);
      }
      // now shift the dates
      startingWeek.setUTCDate(startingWeek.getDate() + daysOffset);
      
      this._d = startingWeek;
    }
    
    // ISO8601 - ordinal date
    else if((/^\d{4}-(\d{3})$/).test(a[0])) {
      var y = parseInt(a[0].slice(0,4),10);
      var d = parseInt(a[0].slice(-3),10);
      
      this._d = new Date(Date.UTC(y,0,d));
    }
  }
  
  // DateTime(year,month,day,[hour, minute, second, millisecond]) (stored as local time)
  else if(a[0]!==undefined && a[1]!==undefined && a[2]!==undefined) {
    this._d = new Date(1970,1,1);
    
    // mandatory
    if(a[0]!==undefined) { this._d.setFullYear(a[0]);     }
    if(a[1]!==undefined) { this._d.setMonth(a[1]-1);      }
    if(a[2]!==undefined) { this._d.setDate(a[2]);         }
    
    // optional
    if(a[3]!==undefined) { this._d.setHours(a[3]);        }
    if(a[4]!==undefined) { this._d.setMinutes(a[4]);      }
    if(a[5]!==undefined) { this._d.setSeconds(a[5]);      }
    if(a[6]!==undefined) { this._d.setMilliseconds(a[6]); }
  }
  
  // in milliseconds (stored as UTC)
  else if(typeof(a[0])==='number') {
    this._d = new Date(a[0]);
  }
  
  // no argument is passed.
  else if(a[0]===undefined) {
    this._d = new Date();
  }
};

// Class Variables --------------------------------------------------------------------------------
DT.i18n = {
  'en': {
    'wdays' : ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    'months': ['January','February','March','April','May','June','July','August','September','October','November','December'],
    'abbrWdays' : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    'abbrMonths': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    'distanceWords': {
      '_filter': function(s, n) { 
        s+= (Math.abs(n) > 1 ? 's' : '');
        s = (n <  0) ? s + ' ago'      : s;
        s = (n >= 0) ? s + ' from now' : s;
        return s;
      },
      'half_a_minute'      : 'half a minute',
      'less_than_x_seconds': 'less than %{count} second',
      'x_minutes'          : '%{count} minute',
      'about_x_hours'      : 'about %{count} hour',
      'x_days'             : '%{count} day',
      'about_x_months'     : 'about %{count} month',
      'x_months'           : '%{count} month',
      'about_x_years'      : 'about %{count} year',
      'over_x_years'       : 'over %{count} year',
      'almost_x_years'     : 'almost %{count} year'
    }
  }
},

// Class Functions --------------------------------------------------------------------------------
DT.now = function() { return new DT(); };

DT.UTC = function() {
  var a = arguments;
  var dt = new DT();
  dt._d = new Date(Date.UTC(a[0], (a[1]-1), a[2]));
  if(a[3]!==undefined) { dt._d.setUTCHours  (a[3]);      }
  if(a[4]!==undefined) { dt._d.setUTCMinutes(a[4]);      }
  if(a[5]!==undefined) { dt._d.setUTCSeconds(a[5]);      }
  if(a[6]!==undefined) { dt._d.setUTCMilliseconds(a[6]); }
  return dt;
};

DT.distance = function(from, to) { return to.time() - from.time(); };

DT.distanceOfTimeInWords = function(from, to, includeSeconds, locale) {
  var locale = locale || 'en';
      props = null,
      diff = DT.distance(from, to)/1000,
      mins = Math.round(Math.abs(diff/60)),
      secs = Math.round(Math.abs(diff)),
      orientation = (diff >= 0) ? 1 : -1,
      between = function(n,a,b) { return (n >= a && n <= b); };
      countLeap = function(dt1, dt2) {
        var y1 = dt1.year(),  y2 = dt2.year(),
            m1 = dt1.month(), m2 = dt2.month();
        
        if(m1 > 2 || (m1==2 && m1==29)) { y1+=1; } // if date is later than 2/29, don't count the start year.
        if(m2 > 2 || (m2==2 && m2==29)) { y2+=1; } // if date is later than 2/29, count the ending year.
        
        for(var c = 0; y1 < y2; y1++) { 
          if(new DT(y1,2,29).day()==29) { ++c; }  
        }
        return c;
      };
  
  if(between(mins, 0, 1)) {
    if(mins===0) { 
      props = { template: 'less_than_x_minutes', count: 1 };
    } else if(includeSeconds) {
      props = between(secs,  0,  4) && { template:'less_than_x_seconds', count:  5 } || 
              between(secs,  5,  9) && { template:'less_than_x_seconds', count: 10 } ||
              between(secs, 10, 19) && { template:'less_than_x_seconds', count: 20 } ||
              between(secs, 20, 29) && { template:'half_a_minute' }                  ||
              between(secs, 40, 59) && { template:'less_than_x_seconds', count: 10 } ||
              { template:'x_minutes', count: 1 };
    } else {
      props = { template:'x_minutes', count: 1 };
    }
  }
  else if(between(mins,     2,    44)) { props = { template:'x_minutes',     count: mins }; }
  else if(between(mins,    45,    89)) { props = { template:'about_x_hours', count: 1 }; }
  else if(between(mins,    90,  1439)) { props = { template:'about_x_hours', count: Math.round(mins/60)    }; }
  else if(between(mins,  1440,  2519)) { props = { template:'x_days',        count: 1 }; }
  else if(between(mins,  2520, 43199)) { props = { template:'x_days',        count: Math.round(mins/1440)  }; }
  else if(between(mins, 43200, 86399)) { props = { template:'about_x_months',count: 1 }; }
  else if(between(mins, 86400,525599)) { props = { template:'x_months',      count: Math.round(mins/43200) }; }
  else {
    var fyear = from.year(), tyear = to.year();
    
    if((from.month()) >= 3) { fyear += 1; }
    if((to.  month()) <  3) { tyear -= 1; }
    
    var minsOffsetForLeap = countLeap(from,to) * 1440,
        minsWithOffset    = mins - minsOffsetForLeap,
        remainder         = minsWithOffset % 525600,
        distanceInYears   = Math.round(minsWithOffset / 525600);
    
    if     (remainder < 131400) { props = { template:'about_x_years',  count: distanceInYears }; } //  1 ~  92 days 
    else if(remainder < 394200) { props = { template:'over_x_years',   count: distanceInYears }; } // 92 ~ 273 days
    else                        { props = { template:'almost_x_years', count: distanceInYears }; }
  }
  
  var text = DT.i18n[locale].distanceWords;
  var str  = text[props.template];
  
  if(text['_filter']) { 
    str = text['_filter'](str, props.count); 
  }
  
  return str.replace(/%\{count\}/g, Math.abs(props.count));
};

// Instance Functions --------------------------------------------------------------------------------
DT.prototype = {
  
  locale: 'en',
  
  // getters
  clone:      function() { return new DT(this.time());                 },
  time:       function() { return this._d.getTime();                   },
  year:       function() { return this._d.getFullYear();               },
  month:      function() { return this._d.getMonth()+1;                },
  day:        function() { return this._d.getDate();                   },
  hour:       function() { return this._d.getHours();                  },
  minute:     function() { return this._d.getMinutes();                },
  second:     function() { return this._d.getSeconds();                },
  millisecond:function() { return this._d.getMilliseconds();           },
  wday:       function() { return this._d.getDay() || 7;               },
  utcOffset:  function() { return this._d.getTimezoneOffset() * -1;    },
  isLeap:     function() { return new DT(this.year(),2,29).day()===29; },
  
  // setters (for internal use only)
  _setDate:   function(n){ this._d.setDate(n); return this; },
  
  // measurement
  distanceTo: function(dt) { return DT.distance(this, dt); },
  distanceOfTimeInWordsToNow: function(includeSeconds) { return DT.distanceOfTimeInWords(this, DT.now(),includeSeconds, this.locale); },
  
  // get the week of the year (0-53)
  weekOfYear: function() {
    var jan1       = new DT(this.year(), 1, 1);
    var firstThurs = jan1.clone()._setDate(1 - jan1.wday() + 4);
    var thisThurs  = this.clone()._setDate(this.day() - this.wday() + 4);
    
    var weekNum = Math.floor(DT.distance(firstThurs, thisThurs)/(864e5*7));
    
    if(jan1.time() <= firstThurs.time()) {
      weekNum+=1;
    }
    
    return weekNum;
  },
  
  // get the year/week/day of the year according to ISO8601
  yearWeekDay: function() {
    var week = this.weekOfYear();
    var year = this.year();
    
    var lastDay = new DT(year, 12, 31);
    if(week === lastDay.weekOfYear()) {
      var lastThurs = lastDay.clone()._setDate(31 - lastDay.wday() + 4);
      
      if(lastDay.time() < lastThurs.time()) {
        week = 1;
        year+= 1;
      }
    }
    
    if(week === 0) {
      var firstThurs = new DT(this.year(), 1, 1);
      firstThurs._setDate(1 - firstThurs.wday() + 4);
      week = firstThurs.weekOfYear();
      year-=1;
    }
    
    return { 'year': year, 'week': week, 'day': this.wday() };
  },
  
  // get the day of year (1-366)
  dayOfYear: function() { 
    var distance = Math.abs(this.distanceTo(new DT(this.year(), 1, 1)));
    return Math.floor(distance/864e5) + 1;
  },
  
  // strftime implementation similar to that of ruby. Some directives were left out.
  strftime: function(s) {
    
    var ptr =  0, // current location
        ret = '', // stores conversion results
        flag= ''; // stores flags for each directive
    while(ptr < s.length) {
      
      // directive is found!
      if(s.charAt(ptr)==='%' && ptr+1 < s.length) {
        
        // look at the char after %
        var c = s.charAt(++ptr); 
        
        // if it's a flag then read the next char (only supports : for now)
        if(c===':' && ptr+1 < s.length) {
          flag+= c;
          c = s.charAt(++ptr);
        }
        
        // actions can be data or function. if it's neither, just concat the key.
        ret+= this._strftimeActions(c, flag);
        
        flag = ''; // clear the flag
      }
      
      // not a directive. carry on.
      else {
        ret+= s.charAt(ptr);
      }
      ptr+= 1;
    }
    
    return ret;
  },
  
  _strftimeActions: function(c, flag) {
    var p = this._pad;
    var text = DT.i18n[this.locale];
    
    // Date (Year, Month, Day)
    if(c==='Y') { return this.year() + '';                   }
    if(c==='C') { return Math.floor(this.year() / 100) + ''; }
    if(c==='y') { return p(this.year() % 100);               }
    if(c==='m') { return p(this.month());                    }
    if(c==='B') { return text.months[this.month()-1];        }
    if(c==='b') { return text.abbrMonths[this.month()-1];    }
    if(c==='d') { return p(this.day());                      }
    if(c==='e') { return this.day()+'';                      }
    if(c==='j') { return p(this.dayOfYear(), 3);             }
    
    // time
    if(c==='H') { return p(this.hour());                     }
    if(c==='k') { return this.hour()+'';                     }
    if(c==='I') { return p(this.hour() % 12 || 12);          }
    if(c==='l') { return  (this.hour() % 12 || 12) + '';     }
    if(c==='P') { return (this.hour() < 12) ? 'am': 'pm';    }
    if(c==='p') { return (this.hour() < 12) ? 'AM': 'PM';    }
    if(c==='M') { return p(this.minute());                   }
    if(c==='S') { return p(this.second());                   }
    if(c==='L') { return p(this.millisecond(),3);            }
    
    // time zone
    if(c==='z') {
      var mins = this.utcOffset();
      return ((mins >= 0) ? '+' : '-') + p(Math.floor(mins / 60)) + 
             ((flag.indexOf(':') >= 0) ? ':' : '') +  p(mins % 60);
    }
    if(c==='Z') { 
      this._d.toTimeString().replace(/GMT[+-].{6}\((.*)\)$/,'$1') 
    }
    
    // day of week
    if(c==='A') { return text.wdays[this.wday()-1];          }
    if(c==='a') { return text.abbrWdays[this.wday()-1];      }
    if(c==='u') { return this.wday()+'';                     }
    if(c==='w') { return this._d.getDay()+'';                }
    
    // ISO8601 week based year
    if(c==='G') { return   this.yearWeekDay().year + '';     }
    if(c==='g') { return p(this.yearWeekDay().year % 100);   }
    if(c==='V') { return p(this.yearWeekDay().week);         }
    
    // week
    if(c==='W') { return p(this.weekOfYear()); }
    
    // seconds since epoch
    if(c==='s') { return Math.floor(this.time()/1000) + ''; }
    
    // literal strings
    if(c==='n') { return "\n"; }
    if(c==='t') { return "\t"; }
    if(c==='%') { return '%';  }
    
    // combinations
    if(c==='c') { return this.strftime('%a %b %e %T %Y'); }
    if(c==='D') { return this.strftime('%m/%d/%y');       }
    if(c==='F') { return this.strftime('%Y-%m-%d');       }
    if(c==='r') { return this.strftime('%I:%M:%S %p');    }
    if(c==='R') { return this.strftime('%H:%M');          }
    if(c==='T') { return this.strftime('%H:%M:%S');       }
    
    return '%' + flag + c;
    
    // 'h': won't be implemented. (use %b)
    // 'N': won't be implemented. (javascript doesn't support micro/nano/pico seconds)
    // 'U': not implemented.
    // 'x': won't be implemented. (use %D)
    // 'X': won't be implemented. (use %T)
    // 'v': won't be implemented. (VMS?)
  },
  
  toDate: function() { 
    return new Date(this.time()); 
  },
  
  toUTCObject: function() { 
    var d = this._d;
    return {
      'time'       : this.time(),
      'year'       : d.getUTCFullYear(),
      'month'      : d.getUTCMonth()+1,
      'day'        : d.getUTCDate(),
      'wday'       : d.getUTCDay() || 7,
      'hour'       : d.getUTCHours(),
      'minute'     : d.getUTCMinutes(),
      'second'     : d.getUTCSeconds(),
      'millisecond': d.getUTCMilliseconds(),
      'dayOfYear'  : this.dayOfYear(),
      'utcOffset'  : 0
    };
  },
  
  toObject: function() {
    return {
      'time'       : this.time(),
      'year'       : this.year(),
      'month'      : this.month(),
      'day'        : this.day(),
      'wday'       : this.wday(),
      'hour'       : this.hour(),
      'minute'     : this.minute(),
      'second'     : this.second(),
      'millisecond': this.millisecond(),
      'dayOfYear'  : this.dayOfYear(),
      'utcOffset'  : this.utcOffset()
    };
  },
  
  toUTCString: function() {
     var d = this._d, p = this._pad;
     return d.getUTCFullYear()     + '-' + 
            p(d.getUTCMonth()+1)   + '-' + 
            p(d.getUTCDate())      + 'T' + 
            p(d.getUTCHours())     + ':' + 
            p(d.getUTCMinutes())   + ':' + 
            p(d.getUTCSeconds())   + 'Z';
  },
  
  toString: function() {
     var p = this._pad;
     return this.year()      + '-' + 
            p(this.month())  + '-' + 
            p(this.day())    + 'T' + 
            p(this.hour())   + ':' + 
            p(this.minute()) + ':' + 
            p(this.second()) + this.strftime('%:z');
  },
  
  _pad: function(num, digits, str) { 
      var plusMinus = '';
      num+='';
      if(num.length > 0 && 
        (num[0]=='-' || num[0]=='+')) {
        plusMinus = num.slice(0,1);
        num = num.slice(1);
      }
      str = (str!==undefined) ? str : '0';
      digits = (digits!==undefined) ? digits : 2;
      while(num.length < digits) { num = str + num; }
      return plusMinus + num;
  }
};

})((typeof exports !== "undefined" && exports !== null) ? exports : this);
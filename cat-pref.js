//http://athleta.gap.com?DI=1


var CatPrefArrayGenerator = function(segObj){
  this.userSeg = segObj.userSeg;
  this.userPrefs = segObj.userPrefs;
  this.categoryArray = [
    {
      cid : "46793",
      name : "Bottoms",
      url : "/browse/category.do?cid=1025878"
    },
    {
      cid : "46750",
      name : "Tops",
      url : "/browse/category.do?cid=1032080"
    },
    {
      cid : "84117",
      name : "Sweaters",
      url : "/browse/category.do?cid=84117"
    },
    {
      cid : "46831",
      name : "Dresses",
      url : "/browse/category.do?cid=89745"
    }
  ];
};

CatPrefArrayGenerator.prototype = {
  constructor : CatPrefArrayGenerator,
  init : function() {
    if (this.userSeg.indexOf('T_')==0 && this.userPrefs.length>0) {
      this.parseUserPrefs();
    }
    else {
      this.triggerCatPrefEvent();
    }
  },
  parseUserPrefs : function() {
    for (i=0;i<this.userPrefs.length;i++) {
      var prefObj = {};
      if (this.userPrefs[i].indexOf("GIRL")==0) {
        prefObj.cid = "1054832";
        prefObj.name = "Girl";
        prefObj.url = "/browse/category.do?cid=1054844";
      }
      else {
        if (this.userPrefs[i].indexOf('CAPRIS')>-1) {
          prefObj.cid = "1025878";
          prefObj.name = "Capris";
          prefObj.url = "/browse/category.do?cid=1058485"
        }
        else if (this.userPrefs[i].match(/(DRESSES|SKIRTS)/)) {
          prefObj.cid = "46831";
          prefObj.name = "Dresses";
          prefObj.url = "/browse/category.do?cid=89745";
        }
        else if (this.userPrefs[i].indexOf('SWIM')>-1) {
          prefObj.cid = "46656";
          prefObj.name = "Swim";
          prefObj.url = "/browse/category.do?cid=1031353";
        }
        else if (this.userPrefs[i].indexOf('OUTERWEAR')>-1) {
          prefObj.cid = "60402";
          prefObj.name = "Sweatshirts";
          prefObj.url = "/browse/category.do?cid=1005761";
        }
        else if (this.userPrefs[i].match(/(BRAS|(SUPPORT\s)?TOPS)/)) {
          prefObj.cid = "46750";
          prefObj.name = "Tops";
          prefObj.url = "/browse/category.do?cid=1032080";
        }
        else if (this.userPrefs[i].indexOf('SWEATERS')>-1) {
          prefObj.cid = "1032080";
          prefObj.name = "Sweaters";
          prefObj.url = "/browse/category.do?cid=84117";
        }
        else if (this.userPrefs[i].indexOf('SKORTS')>-1) {
          prefObj.cid = "1025878";
          prefObj.name = "Skorts";
          prefObj.url = "/browse/category.do?cid=86354";
        }
        else {
          prefObj.cid = "46793";
          prefObj.name = "Bottoms";
          prefObj.url = "/browse/category.do?cid=1025878";
        }
      }
      this.categoryArray.splice(i,0,prefObj);
    }

    var foundCids = [];
    this.categoryArray = this.categoryArray.filter(function(v){
      if (foundCids.indexOf(v.cid)==-1) {
        foundCids.push(v.cid);
        return true;
      }
      else {
        return false;
      }
    });
    if (this.categoryArray.length>4) {
      this.categoryArray = this.categoryArray.slice(0,4);
    }
    this.triggerCatPrefEvent();
  },
  triggerCatPrefEvent : function() {
    var $this = this;
    jQuery(document).ready(function(){
      jQuery(document).trigger('userCatPrefs:ready',[$this.categoryArray]);
    });
  }
};

var CatPrefSegmentationManager = function(xpmObj,catPrefString) {
  var segPrefix = (xpmObj.Segment=="B") ? "T_CATPREF" : "C_CATPREF";
  this.userPrefs = [];
  if (catPrefString) {
    var xpmPrefArray = catPrefString.split('|');
    for (i=0;i<xpmPrefArray.length;i++) {
      if (xpmPrefArray[i].length>2) {
        this.userPrefs.push(xpmPrefArray[i]);
      }
    }
  }
  var segSuffix = (this.userPrefs.length>4) ? 4 : this.userPrefs.length;
  this.userSeg = (this.userPrefs.length>0) ? segPrefix + "TRUE" + segSuffix : segPrefix + "FALSE";
  xpmObj.Segment = this.userSeg;
  personalizationService.api.personalizationDone([xpmObj, {}]);
};

personalizationService.api.onPersonalization(function(xpmObj) {
  var abTest = xpmObj['202'];
  var catPrefString = xpmObj['ATUSCATPREF'];
  if (abTest) {
    var newUserSeg = new CatPrefSegmentationManager(abTest,catPrefString);
    if (location.pathname.indexOf('home.do')>-1 || location.pathname=="/") {
      var newCatPrefArray = new CatPrefArrayGenerator(newUserSeg);
      newCatPrefArray.init();
    }
  }
});

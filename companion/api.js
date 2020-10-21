import { Base64 } from "./base64.js"

export function API(apiKey) {
};

let ApiUrl = "https://toggl.com/api/v8";
let ApiUrlV9 = "https://toggl.com/api/v9";
let UserData;
let CreatedWith = "Tracks-1.0.6";
let credentials;
let entryDescription = "";
let base64 = new Base64();

API.prototype.setDescription = function(description) {
  console.log("API: set entry description - " + description);
  entryDescription = description;
}

API.prototype.setToken = function(token) {
  console.log("API: set token - " + token);
  credentials = 'Basic ' + base64.encode(token + ':api_token');
}

API.prototype.fetchUser = function() {
  let self = this;
  //console.log("API - Fetch User Data");
  return new Promise(function(resolve, reject) {
    let url = ApiUrl + "/me?with_related_data=true";    

    var obj = {  
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': credentials
    }};
    
    fetch(url, obj)
    .then(response => response.json())
    .then(data => {
      UserData = data.data;
      //console.log("Got JSON response from server:" + JSON.stringify(data));
      resolve(JSON.stringify(data));
    }).catch(function (error) {
      reject(error);
    });
  });
}

API.prototype.stopEntry = function(timeEntry) {
  let self = this;
  //console.log("API - Stop Entry");
  return new Promise(function(resolve, reject) {
    let url = ApiUrlV9 + "/time_entries/" + timeEntry.id;
    const stopTime = new Date();
    const startTime = new Date(-timeEntry.duration * 1000);
    const entry = {
      stop: stopTime.toISOString(),
      duration: Math.floor((stopTime - startTime) / 1000)
    };
    
    var obj = {  
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': credentials
      },
      body: JSON.stringify(entry)
    }

    fetch(url, obj)
    .then(response => response.json())
    .then(data => {
//      console.log("STOPP Got JSON response from server:" + JSON.stringify(data));
      resolve(JSON.stringify(data));
    }).catch(function (error) {
      reject(error);
    });
  });

}

API.prototype.startEntry = function(timeEntry) {
  let self = this;
  console.log("API - Start Entry");
  return new Promise(function(resolve, reject) {
    let url = ApiUrlV9 + "/time_entries";
    const start = new Date();
    let entry;

    if (!!timeEntry) {
      entry = {
        start: start.toISOString(),
        stop: null,
        duration: -parseInt(start.getTime() / 1000, 10),
        description: timeEntry.description,
        pid: timeEntry.pid,
        tid: timeEntry.tid || null,
        wid: timeEntry.wid || UserData.default_wid,
        tags: timeEntry.tags || null,
        billable: timeEntry.billable || false,
        created_with: CreatedWith
      };
    } else {
      entry = {
        start: start.toISOString(),
        stop: null,
        duration: -parseInt(start.getTime() / 1000, 10),
        description: entryDescription,
        pid: null,
        tid: null,
        wid: UserData.default_wid,
        tags: null,
        billable: false,
        created_with: CreatedWith
      };
    }

    var obj = {  
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': credentials
      },
      body: JSON.stringify(entry)
    };
    
    fetch(url, obj)
    .then(response => response.json())
    .then(data => {
      resolve(JSON.stringify(data));
    }).catch(function (error) {
      console.log(JSON.stringify(error))
      reject(error);
    });
  });
}

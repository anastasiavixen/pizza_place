pizzaViewFunctions : { //functions that have to do with building ui elements and adding to the DOM
	pizzaView = {};
	/* function: build a html select element with data passed in, also adds an onchange event
	 * params:
	 * dataObject: object of the data to parse/use
	 * dataType: tells you what kind of data element it is, so you can make modifications if neccessary 
	 * return: a string representing the html select element
	 * */
	pizzaView.buildSelectElement = function(dataObject, dataType){ 
		var selectString = '<select>';	
		var index;	
	
		if(dataType == "locations"){
			var selectString = "<select  id='locations_select' onchange='pizzaView.locationsOnChange(this)'>";			
		} else if(dataType == "pizzas"){
			var selectString = "<select  id='pizzas_select' onchange='pizzaView.pizzasOnChange(this)'>";
		}
	
		for(index = 0; index < dataObject.length; ++index){	
			var city = "";
			if(dataType == "locations"){
				city = " - " + dataObject[index].city;
			}		
			selectString += '<option value="'+ dataObject[index].id +'">' + dataObject[index].name + city + '</option>';			
		}
		selectString += "</select>";
		return selectString;
	}
	/* function:  build a list html element with data passed in
	 * params:
	 * listArray: array of list items to use to build the list html element
	 * return: a string representing the html list element
	 * */
	pizzaView.buildListElement = function(listArray){
		var listString = '<ul>';
		var index;		
		for(index = 0; index < listArray.length; ++index){		
			listString += '<li>' + listArray[index] + '</li>';			
		}
		listString += "</ul>";
		return listString;
	}
	/* function: build an array of the name properties from a data objet	 
	 * params:
	 * dataObject: object of the data to parse/use
	 * return: an array with only the name properties contained from the dataObject
	 * */
	pizzaView.getListFromObject = function(dataObject){
		var dataList = [];
		for (index = 0; index < dataObject.length; ++index) {
			entry = dataObject[index].name;
			dataList.push(entry);
		}
		return dataList;
	}
	/* function: build the locations html element from the locations data object
	 * params: none
	 * return: a string representing the select element using the data from the locations data object
	 * */
	pizzaView.buildLocations = function(){
		listString = '';
		var locationsObject = pizzaData.getLocationsObject()
		var listString = pizzaView.buildSelectElement(locationsObject,"locations");
		return listString;
	}
	/* function: build the pizza html element from the pizza data object
	 * params: 
	 * filterNumber: this would be a location id, to use to filter the pizza object
	 * return: a string representing the select element using the data from the pizza data object,
	 * filtered by the location ID number passed in
	 * */
	pizzaView.buildPizzasFromLocations = function(filterNumber){
		listString = '';
		var pizzasObject = pizzaData.getPizzasObject(filterNumber)
		var listString = pizzaView.buildSelectElement(pizzasObject,"pizzas");
		return listString;
	}
	/* function: build the toppings html element from the toppings data object
	 * params: 
	 * filterNumber: this would be a pizza id, to use to filter the toppings object
	 * return: a string representing the select element using the data from the toppings data object,
	 * filtered by the pizza ID number passed in
	 * */
	pizzaView.buildToppingsFromPizza = function(filterNumber){
		listString = '';
		var toppingsObject = pizzaData.getToppingsObject(filterNumber);
		var listArray = pizzaView.getListFromObject(toppingsObject);
		var listString = pizzaView.buildListElement(listArray);
		return listString;
	}
	/* function: add the data-filled html select string to the DOM, to create the html element
	 * params:
	 * elementId: element id is the id in the current DOM to use to find and attach the new html element
	 * filterId: [optional] the filter id is used for the pizza and toppings object to filter the data
	 * return: none
	 * */
	pizzaView.addElementToDom = function(elementId, filterId){
		var htmlString = pizzaView.buildLocations();
		if(elementId == "pizzas"){
			htmlString = pizzaView.buildPizzasFromLocations(filterId);
		}else if(elementId == "toppings"){
			htmlString = pizzaView.buildToppingsFromPizza(filterId);
		}
		
		var div = document.createElement('div');
		var domElement = document.getElementById(elementId);
		domElement.innerHTML = htmlString;
		return true;
	}
	/* function: this is to update the pizza html element when the location element changes
	 * params:
	 * element: this is used to get the id of the element that was changed
	 * return: none
	 * */
	pizzaView.locationsOnChange = function(element){
		var selectedValue = document.getElementById(element.id).value;
		pizzaView.addElementToDom("pizzas", selectedValue);
		document.getElementById('pizzas_select').onchange();
		return true;
	}
	/* function: this is to update the toppings html element when the pizza element changes
	 * params:
	 * element: this is used to get the id of the element that was changed
	 * return: none
	 * */
	pizzaView.pizzasOnChange = function(element){
		var selectedValue = document.getElementById(element.id).value;
		pizzaView.addElementToDom("toppings", selectedValue);
		return true;
	}
}

pizzaDataFunctions : { //functions that have to do with getting the raw data
	pizzaData = {};
	/* function: build an object from the json string that is returned from the file contents
	 * params: none
	 * return: the locations object
	 * */
	pizzaData.getLocationsObject = function() {
		var locations = '';
		locations = pizzaData.parseJson('data/locations.txt');
		return locations;
	}
	/* function: build an object from the json string that is returned from the file contents
	 * params: 
	 * locationId: use the location ID to filter the pizza list, default value is 1
	 * return: the pizzas object
	 * */
	pizzaData.getPizzasObject = function (locationId){
		var pizzas = '';
		pizzas = pizzaData.parseJson('data/pizzas.txt'); //full pizza list
		
		if(locationId == null){
			locationId = "1";
		}
		pizzas = pizzaData.getFilteredObject(pizzas,"pizzas",locationId);		
		return pizzas;
	}
	/* function: build an object from the json string that is returned from the file contents
	 * params: 
	 * pizzaIds: use the pizza ID to filter the toppings list, default value is 1
	 * return: the toppings object
	 * */
	pizzaData.getToppingsObject = function (pizzaIds){
		var toppings = '';
		toppings = pizzaData.parseJson('data/toppings.txt'); //full pizza list
		if(pizzaIds == null){ //if you pass in a pizza Id, get only toppings for that pizza
			pizzaIds = "1";
		}
		toppings = pizzaData.getFilteredObject(toppings,"toppings",pizzaIds);		
		return toppings;
	}
	/* function: use a search value to search an object, to see if there is a match
	 * params:
	 * dataObject: data object to searh
	 * searchType: which search are we performing? we need to know this so that we can customize
	 * the search (use a different property) for that search type
	 * searchValue: this is what we are using to search by, usually an ID
	 * return: the object, filtered by search matches
	 * */
	pizzaData.getFilteredObject = function(dataObject, searchType, searchValue){
	    var results = [];
	    var index;
	    var entry;
	    var searchValue = searchValue.toString();
		var dataObjectLength = Object.keys(dataObject).length
	    
	    for (index = 0; index < dataObject.length; ++index) {
	        entry = dataObject[index];
	        if(searchType == "pizzas"){
		        if (entry && entry.locationId && entry.locationId.indexOf(searchValue) != -1) {
		            results.push(entry);
		        }
	        }else if(searchType == "toppings"){	        	
		        if (entry && entry.pizzaIds && entry.pizzaIds.indexOf(searchValue) != -1) {
		            results.push(entry);
		        }
	        }
	    }	
	    return results;
	}	
	/* function: read a flat file with a json string in it
	 * params:
	 * file: the location and name of the flat file
	 * return: the data string from the file that represents the json object
	 * */
	pizzaData.readDataFile = function(file) {
		var dataString = '';
	    var rawFile = new XMLHttpRequest();
	    rawFile.open("GET", file, false);
	    rawFile.onreadystatechange = function () {
	        if(rawFile.readyState === 4) {
	            if(rawFile.status === 200 || rawFile.status == 0) {
	                var allText = rawFile.responseText;
	                dataString = allText;
	            }
	        }
	    }
	    rawFile.send(null);
		return dataString;
	}
	/* function: parse a json string into a native json object
	 * params: 
	 * dataFile: the location and name of the flat file
	 * return: return data object
	 * */
	pizzaData.parseJson = function(dataFile){
		var data = pizzaData.readDataFile(dataFile).trim(/"/);
		data = JSON.parse(data);
		return data;
	}	
}
pizzaMainFunctions : { //main line of code for the app
	var pizzaMain = {};
	/* function: the main line of programming logic, to start the app
	 * params: none
	 * return: none
	 * */
	pizzaMain.init = function(){
		pizzaView.addElementToDom("locations");
		document.getElementById('locations_select').onchange();
		document.getElementById('pizzas_select').onchange();
		return true;
	}
}
document.addEventListener("DOMContentLoaded", function(event) { 
	pizzaMain.init(); //start app here
});
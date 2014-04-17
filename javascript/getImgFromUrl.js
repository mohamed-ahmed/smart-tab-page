//my callback function

function mySandwich(param1, param2, callback) {  
    alert('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);
    setTimeout(function(){
    	alert("Hello");
	    callback(100);  

    },3000);
}  
  
mySandwich('ham', 'cheese', function (value) {  
    alert('Finished eating my sandwich. ' + value);  
});  


var arrOfObj = [
    {
        "Name": "Zak",
        "Age": 25
    },
    {
        "Name": "Adel",
        "Age": 38
    },
    {
        "Name": "Yori",
        "Age": 28
    }
];
 
 
 
// sort an array of objects
/*
arrOfObj.sort(function (a, b) {
    return a.Name > b.Name;
});
*/
 
sortArrOfObjectsByParam(arrOfObj, "Name");
console.log("ASCENDING: " + arrOfObj[0].Name + ", " + arrOfObj[1].Name + ", " + arrOfObj[2].Name);
//alert("ASCENDING: " + arrOfObj[0].Name + ", " + arrOfObj[1].Name + ", " + arrOfObj[2].Name);
 
sortArrOfObjectsByParam(arrOfObj, "Name", false);
console.log("DECENDING: " + arrOfObj[0].Name + ", " + arrOfObj[1].Name + ", " + arrOfObj[2].Name);
//alert("DECENDING: " + arrOfObj[0].Name + ", " + arrOfObj[1].Name + ", " + arrOfObj[2].Name);
 
 
/*
    Sorts an array of objects (note: sorts the original array and returns nothing)
 
    @arrToSort             array           javascript array of objects
    @strObjParamToSortBy   string          name of obj param to sort by, and an 
    @sortAsc               bool (optional) sort ascending or decending (defaults to true and sorts in ascending order)
    returns                void            because the original array that gets passed in is sorted
*/
function sortArrOfObjectsByParam(arrToSort /* array */, strObjParamToSortBy /* string */, sortAscending /* bool(optional, defaults to true) */) {
    if(sortAscending == undefined) sortAscending = true;  // default to true
    
    if(sortAscending) {
        arrToSort.sort(function (a, b) {
            return a[strObjParamToSortBy] > b[strObjParamToSortBy];
        });
    }
    else {
        arrToSort.sort(function (a, b) {
            return a[strObjParamToSortBy] < b[strObjParamToSortBy];
        });
    }
}
function createEntry(key, value)
{

	var element = $('#ls_row_wrapper_sample').clone();

    $("#ls_name", element).html(key);
    $(".ls_value", element).val(value);

    element.show();
    $("#ls_data").append(element);

    //ls.toggleTabForElement(element);
    //ls.initHeights();
}

$(document).ready(function()
{
   for(var key in localStorage)
   {
        createEntry(key, localStorage[key]);
   }
    ls.init();
});

/*

function createEntry(key, value)
{
    var element = $('#ls_row_wrapper_sample').clone();

    $("#ls_name", element).html(key);
    $(".ls_value", element).val(value);

    element.show();
    $("#ls_data").append(element);

    //ls.toggleTabForElement(element);
    //ls.initHeights();
}

$(document).ready(function()
{
    localStorage["test1"] = "1";
    localStorage["test2"] = "test";
    localStorage["test3"] = "bla";
    localStorage["test4"] = "hi";

   for(var key in localStorage)
   {
        createEntry(key, localStorage[key]);
   }

    ls.init();
});
*/


var ls = {
	currentLocalStorage: [],
	
	p : {
		tabsHeight : [],
		isEditValueClicked : false,
		isEditValueInputClicked : false,
		editedName : "",
		camefromfocus : -1
	},
	init : function() {
		ls.getCurrentLocalStorage();
	},
	
	initAfterGotLocalStorage: function() {
		for(var key in ls.currentLocalStorage)
		{
		    ls.createEntry(key, ls.currentLocalStorage[key]);
		}
   
		ls.initHeights();
		//Edit Name Button
		$('.ls_row_wrapper').each(function(){
			ls.initSingleRow($(this));
		});
		
		//Create New 
		$('#create_new').click(function(e){
			e.preventDefault();
			ls.createNew();	
		});
		
		//Delete All
		$('#delete_all').click(function(){
			if ($('.ls_row_wrapper').length > 0) 
				{
				$('#ls_data').animate({'opacity':0},350,function(){
					$(this).animate({'height':0},350,function(){
						$('.ls_row_wrapper').each(function(){
							$('#ls_data').css({'height':'','opacity':''});
							var key = $(this).find('.ls_name').html();
							//var value = $(this).find('input.ls_value').val();

							$(this).remove();
						});		
					});
				});
			}
			
			ls.currentLocalStorage = [];
			ls.sendCurrentLocalStorage();
		});		
	},
	
	getCurrentLocalStorage: function()
	{
		var port = chrome.extension.connect({name: 'myScript'});
		port.onMessage.addListener(function(msg) {
			if (msg)
			{
		    	ls.currentLocalStorage = JSON.parse(msg);
			}
			
			ls.initAfterGotLocalStorage();
		});
	},
	
	sendCurrentLocalStorage: function()
	{
		chrome.extension.sendRequest({'route': 'myScript', 'data': JSON.stringify(ls.currentLocalStorage)});
	},
	
	createEntry: function(key, value)
	{
		var element = $('#ls_row_wrapper_sample').clone();
	
	    $("#ls_name", element).html(key);
	    $(".ls_value", element).val(value);
	
	    element.show();
	    $("#ls_data").append(element);
	},
	
	initSingleRow : function(obj) {
		ls.toggleTab(obj.find('div.header'));		
		ls.editValueButton(obj.find('.editName'));
		ls.deleteRow(obj.find('a.delete'));
		ls.valueKeyPress(obj.find('input.ls_value'))
		
	},
	deleteRow : function(obj) {
		obj.click(function(){
			obj.closest('.ls_row_wrapper').animate({opacity: 0},250,function(){
				$(this).animate({height: 0},250,function(){
					$(this).remove();
				});
			});
			
			var key = obj.closest('.ls_row_wrapper').find('.ls_name').html();

			delete ls.currentLocalStorage[key];
			ls.sendCurrentLocalStorage();
		});
	},
	valueKeyPress : function(obj) {
		obj.keyup(function(){
			var key = obj.closest('.ls_row_wrapper').find('.ls_name').html();
			obj.closest('.ls_row_wrapper').find('.saveKey').addClass('saved').html('<span class="img"></span>Saved');
			var value = obj.val();

			ls.currentLocalStorage[key] = value;
			ls.sendCurrentLocalStorage();
		});
		obj.focusout(function(){
			var currentObj = $(this);
			$('.saveKey').each(function(){
				if ($(this) != currentObj)
				{
					$(this).removeClass('saved').html('<span class="img"></span>Save');
				}
			});
		});
	},
    toggleTab: function(obj) {
			obj.next('.content').hide();
			obj.click(function() {
				ls.singleTabToggeling(obj);
			});
    },
	singleTabToggeling : function(obj) {
			if (!ls.p.isEditValueClicked && !ls.p.isEditValueInputClicked) {
				obj.next().slideToggle('fast');
				obj.parent().toggleClass('open');
			}
			$('.saveKey').each(function(){
				$(this).removeClass('saved').html('<span class="img"></span>Save');
			});
			ls.p.isEditValueClicked = false;
			ls.p.isEditValueInputClicked = false;
	},
    toggleTabForElement: function(element) {
        $('div.header', element).click(function() {
            $(this).next().slideToggle('fast');
            $(this).parent().toggleClass('open');
        });
    },
	initHeights : function() {
		$('.ls_row_wrapper .content').each(function(index){
			ls.p.tabsHeight[index] = $(this).css('height');
			$(this).css('height',$(this).css('height'));
		});
	},
	createNew : function() {
			$('#ls_data').prepend('<div class="ls_row_wrapper" id="ls_row_wrapper_sample"><div class="header"><div class="indicationArrow">&nbsp;</div><span id="ls_name" class="ls_name">New Field</span> <a href="#" class="editName"><span class="img"></span>Save Value</a></div><div class="content"><input type="text" value="Enter Value" class="ls_value"><div class="content_links"><a class="saveKey" href="#"><span class="img"></span>Save</a><a class="delete" href="#"><span class="img"></span>Delete</a></div></div></div>')
			$('#ls_data .ls_row_wrapper:first-child').css({'height' : 0, 'overflow':'hidden', 'opacity' : '0'}).animate({'height':'34px'},250,function(){
				$(this).animate({'opacity' : '1'},250, function() {
					$(this).css({'height':'','overflow' : ''});
				});
			});
			ls.initSingleRow($('#ls_data .ls_row_wrapper:first-child'));
			$('#ls_data .ls_row_wrapper:first-child').find('.editName').click();

		},
	AfterEditingValueNewRaw : function(obj) {
		ls.onSave(obj);
		//obj.css('display','');			
		$('.ls_row_wrapper:first-child div.header').click(function() {
			ls.singleTabToggeling(obj.parent());
		});		
	},
	
	keyChangedTo: function(previousKey, key, value)
	{
		delete ls.currentLocalStorage[previousKey];
		ls.currentLocalStorage[key] = value
		
		ls.sendCurrentLocalStorage();
	},
	
	editValueButton : function(obj) {
		//On Edit
		obj.click(function(){
			var index = obj.parent().parent().index();
			ls.p.isEditValueClicked = true;
			if (!(ls.p.camefromfocus == index) || !obj.hasClass('saveName')) {
				obj.parent().css('padding','4px');
				ls.p.editedName = obj.prev();
				obj.prev().replaceWith('<input type="text" class="ls_name_edit" value="' + ls.p.editedName.html() + '">');
				var previousKey = obj.prev().val();

				obj.addClass('saveName');
				obj.closest('.header').addClass('editMode');
				obj.prev().focus().bind('focusout.elementFocusout',function(){

					//Local Storage
					var key = obj.prev().val();

					//console.log(key,previousKey.toString());
					if (key != previousKey) {
						var value = obj.closest('.ls_row_wrapper').find('input.ls_value').val();
						//console.log(previousKey.toString());

						ls.keyChangedTo(previousKey, key, value);
					}	

					//Design
					obj.removeClass('saveName');
					ls.onSave(obj);
					ls.p.camefromfocus = obj.parent().parent().index();
					obj.closest('.header').removeClass('editMode');
					obj.prev().unbind('focusout.elementFocusout');
					obj.prev().unbind('keypress.elementFocusout');
				});
				
				
				obj.prev().focus().bind('keypress.elementFocusout',function(e){
					 var code = (e.keyCode ? e.keyCode : e.which);
					 //on Enter
					 var isTabBarOpen = obj.closest('.ls_row_wrapper').hasClass('open');
					 if (code == 13) {
					 	obj.removeClass('saveName');
						ls.onSave(obj);
						ls.p.camefromfocus = obj.parent().parent().index();
						if (!isTabBarOpen) {
							obj.closest('.header').removeClass('editMode').click();
						}
						obj.closest('.ls_row_wrapper').find('input.ls_value').focus();
						obj.prev().unbind('focusout.elementFocusout');
						obj.prev().unbind('keypress.elementFocusout');
						
						
						//Local Storage
						var key = obj.prev().html();

						//console.log(key,previousKey.toString());
						if (key != previousKey) {
							var value = obj.closest('.ls_row_wrapper').find('input.ls_value').val();
							//console.log(previousKey.toString());
	
							ls.keyChangedTo(previousKey, key, value);
						}
					 }
				});
				
				obj.prev().bind('click',function(){
					ls.p.isEditValueInputClicked = true;
				});
				
				obj.html('<span class="img"></span>Save');
				//obj.html('');
				
			} else {
			}
			if (ls.p.camefromfocus) {
				ls.p.camefromfocus = -1000;
			}
		});
	
	},
	editValueInput : function(obj) {
		ls.p.isEditValueInputClicked = true;
	},
	onEdit : function(obj) {
	
	},
	onSave : function(obj) {
		obj.parent().css('padding','8px');
		obj.prev().replaceWith('<span id="ls_name" class="ls_name">'+$('.ls_name_edit').val()+'</span>');
		obj.html('<span class="img"></span>Edit value');
	}
}

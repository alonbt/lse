var ls = {
	p : {
		tabsHeight : [],
		isEditValueClicked : false,
		isEditValueInputClicked : false,
		editedName : "",
		camefromfocus : -1
	},
	init : function() {
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
			$('.ls_row_wrapper').each(function(){
				$(this).remove();
			});
		});
		
	},
	initSingleRow : function(obj) {
		ls.toggleTab(obj.find('div.header'));		
		ls.editValueButton(obj.find('.editName'));
		ls.deleteRow(obj.find('a.delete'));
		ls.valueKeyPress(obj.find('input.ls_value'))
		
	},
	deleteRow : function(obj) {
		obj.click(function(){
			obj.closest('.ls_row_wrapper').remove();
		});
	},
	valueKeyPress : function(obj) {
		console.log(obj);
		obj.keypress(function(){
			obj.val();
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
			$('#ls_data').prepend('<div class="ls_row_wrapper" id="ls_row_wrapper_sample"><div class="header"><span id="ls_name" class="ls_name">New Field</span> <a href="#" class="editName"><span class="img"></span>Save Value</a></div><div class="content"><input type="text" value="Enter Value" class="ls_value"><div class="content_links"><a class="delete" href="#"><span class="img"></span>Delete</a></div></div></div>')
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
	editValueButton : function(obj) {
		//On Edit
		obj.click(function(){
			var index = obj.parent().parent().index();
			ls.p.isEditValueClicked = true;
			if (!(ls.p.camefromfocus == index) || !obj.hasClass('saveName')) {
				obj.parent().css('padding','4px');
				ls.p.editedName = obj.prev();
				obj.prev().replaceWith('<input type="text" class="ls_name_edit" value="' + ls.p.editedName.html() + '">');
				obj.addClass('saveName');
				obj.prev().focus().bind('focusout.elementFocusout',function(){
					obj.removeClass('saveName');
					obj.prev().unbind('focusout.elementFocusout');
					ls.onSave(obj);
					ls.p.camefromfocus = obj.parent().parent().index();
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

var ls = {
	p : {
		tabsHeight : [],
		isEditValueClicked : false,
		isEditValueInputClicked : false,
		isEdit : false,
		editedName : "",
		camefromfocus : -1
	},
	init : function() {
		ls.initHeights();
		$('#ls_data .content').hide();
		
		//Activate toggle Buttons
		ls.toggleTab();
		
		//Create New 
		$('#create_new').click(function(e){
			e.preventDefault();
			ls.createNew();	
		});
		
		//Edit Name Button
		$('.editName').each(function(){
			ls.editValueButton($(this));
		});
	},
    toggleTab: function() {
        $('.ls_row_wrapper div.header').click(function() {
			ls.singleTabToggeling($(this));
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
			$('#ls_data .ls_row_wrapper:first-child').before('<div class="ls_row_wrapper" id="ls_row_wrapper_sample" style="display: none"><div class="header"><input type="text" value="InsertKeyName" class="ls_name_edit"> <a href="#" class="editName saveName"><span class="img"></span>Save Value</a></div><div class="content"><input type="text" value="Enter Value" id="ls_value"><div class="content_links"><a id="save" href="#"><span class="img"></span>Save</a>&nbsp;<a id="delete" href="#"><span class="img"></span>Delete</a></div></div></div>')
			$('#ls_data .ls_row_wrapper:first-child').css('display','block').find('.content').css('display','none').find('.saveName').css('display','block');
			$('#ls_data .ls_row_wrapper:first-child').find('input.ls_name_edit').focus().bind('focusout.firstfocus',function(event){
				ls.p.isEditValueClicked = false;
				ls.AfterEditingValueNewRaw($(this).next());
				
				//Edit Name Button
				$('#ls_data .ls_row_wrapper:first-child').find('.editName').on('click',function(){
					ls.editValueButton($(this));
				});
				$('#ls_data .ls_row_wrapper:first-child').find('input.ls_name_edit').unbind('focusout.firstfocus')
				
			});	
			
		},
	AfterEditingValueNewRaw : function(obj) {
		ls.onSave(obj);
		obj.css('display','');			
		$('.ls_row_wrapper:first-child div.header').click(function() {
			ls.singleTabToggeling(obj.parent());
		});		
	},
	editValueButton : function(obj) {
		//On Edit
		obj.click(function(){
			var index = obj.parent().parent().index();
			ls.p.isEditValueClicked = true;
			if (!ls.p.isEdit && !(ls.p.camefromfocus == index)) {
				ls.p.isEdit = true;
				obj.parent().css('padding','4px');
				ls.p.editedName = obj.prev();
				obj.prev().replaceWith('<input type="text" class="ls_name_edit" value="' + ls.p.editedName.html() + '">');
				obj.prev().focus().bind('focusout.elementFocusout',function(){
					obj.prev().unbind('focusout.elementFocusout');
					ls.onSave(obj);
					ls.p.camefromfocus = obj.parent().parent().index();
				});
				
				obj.prev().bind('click',function(){
					console.log('clicked');
					ls.p.isEditValueInputClicked = true;
				});
				
				obj.html('<span class="img"></span>Save');
				//obj.html('');
				obj.addClass('saveName');
				
			} else {
				//ls.p.isEdit = true;
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
		obj.removeClass('saveName');
		obj.prev().replaceWith('<span id="ls_name" class="ls_name">'+$('.ls_name_edit').val()+'</span>');
		obj.html('<span class="img"></span>Edit value');
		ls.p.isEdit = false;
		
		$('.saveName').click(function(){
			ls.editValueButton($(this));
		});	
	}
}

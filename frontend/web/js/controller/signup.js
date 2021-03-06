var Signup={
	modal: '#signup',
	page:'#page-signup',
	parent: '',
	form_id:'#register-form',
	validate:true,
	state: 'Indiana',
	country: 'United States',
	zipcode: false,
	lat: 0,
	lng: 0,
	data_validate:'',
	initialize:function(){
		if(isMobile){
			Default.hideHeaderFooter();
			$('body').addClass('no-login');
			Signup.parent = Signup.page;
		}else{
			Signup.parent = Signup.modal;
			Signup.OnShowModalSignUp();
			Signup.OnHideModalSignUp();
			Signup.OnClickLogin();
			Signup.ShowModal();
			// Signup.Customscrollbar();
			Signup.OnClickBackdrop();
			Signup.OnClickSubmitForm();
			Signup.AutoValidateEmail();
			Signup.AutoValidateUsername();

		}
		Signup.OnShowDatePicker();
		Signup.OnChangeGender();
		Signup.validateZipcode();
		Signup.OnAfterValidateForm();
		Signup.OnBeforeSubmitForm();
		Signup.OnEventEnterForm();
	},

	OnEventEnterForm: function(){
		var btn = $(Signup.parent).find('.btn-control');
		$(Signup.parent).find(Signup.form_id).keypress(function( event ) {
			if ( event.which == 13 ) {
				btn.trigger('click');
			}
		});
	},

	ShowErrorValidate: function(validate){
		$.each(Signup.data_validate.data,function(i,e){
			if(validate){
				var target = $('.field-'+ validate);
				if(validate == i){
					target.removeClass('has-success').addClass('has-error');
					target.find('.help-block').text(e);
					return false;
				}
			}else{
				var target = $('.field-'+ i);
				target.removeClass('has-success').addClass('has-error');
				target.find('.help-block').text(e);
			}
		})
	},

	AutoValidateEmail: function(){
		if($(Signup.parent).find('#user-email').val() != ""){
			Ajax.user_signup($(Signup.form_id)).then(function(data){
				Signup.data_validate = $.parseJSON(data);
				if(Signup.data_validate.status == 0){
					setTimeout(function(){
						Signup.ShowErrorValidate('user-email');
					}, 500);
				}
			});
		}

		$(Signup.parent).find('#user-email').on('blur',function(){
			Ajax.user_signup($(Signup.form_id)).then(function(data){
				Signup.data_validate = $.parseJSON(data);
				if(Signup.data_validate.status == 0){
					setTimeout(function(){
						Signup.ShowErrorValidate('user-email');
					}, 500);
				}
			});
		});
	},

	AutoValidateUsername: function(){
		if($(Signup.parent).find('#user-username').val() != ""){
			Ajax.user_signup($(Signup.form_id)).then(function(data){
				Signup.data_validate = $.parseJSON(data);
				if(Signup.data_validate.status == 0){
					setTimeout(function(){
						Signup.ShowErrorValidate('user-username');
					}, 500);
				}
			});
		}

		$(Signup.parent).find('#user-username').on('blur',function(){
			Ajax.user_signup($(Signup.form_id)).then(function(data){
				Signup.data_validate = $.parseJSON(data);
				if(Signup.data_validate.status == 0){
					setTimeout(function(){
						Signup.ShowErrorValidate('user-username');
					}, 500);
				}
			});
		});
	},

	OnClickSubmitForm: function(){
		var btn = $(Signup.parent).find('.btn-control');

		btn.unbind();
		btn.on('click',function(){
			if(Signup.zipcode){
				// Check if user invitation form is submitted
				if(isUserInvitation){
					Ajax.user_join($(Signup.form_id), isUserInvitation).then(function(data){
						Signup.data_validate = $.parseJSON(data);
						console.log(Signup.data_validate);
						if(Signup.data_validate.status == 0){
							Signup.ShowErrorValidate();
						}else{
							isGuest = '';
							UserLogin = Signup.data_validate.data;
							sessionStorage.on_boarding = 1;
							Login.OnCallBackAfterLogin();
							$('.menu_top').removeClass('deactive');
							$('#btn_meet').removeClass('deactive');
							$(Signup.modal).modal('hide');

							// Initialize chat and display the invited groups chat popup
							ChatInbox.initialize();
							ChatInbox.activateTab('chat_discussion');
							setTimeout(function(){
								// Display channel welcome modal
								LandingPage.showLandingChannelWelcome();
								$(ChatInbox.modal).find("div[data-post='"+Signup.data_validate.data.post_id+"']").closest('li').trigger('click');

								//todo landing data modal should be open.
								setTimeout(function(){
									Ajax.top_landing().then(function(res){
										LandingPage.parent = LandingPage.modal;
										LandingPage.data = $.parseJSON(res);
										LandingPage.GetTemplate();
									});
									//LandingPage.initialize();
								}, 300);
							}, 300);
						}
					});
				} else {
					Ajax.user_signup($(Signup.form_id)).then(function(data){
						Signup.data_validate = $.parseJSON(data);
						if(Signup.data_validate.status == 0){
							Signup.ShowErrorValidate();
						}else{
							isGuest = '';
							UserLogin = Signup.data_validate.data;
							sessionStorage.on_boarding = 1;
							Login.OnCallBackAfterLogin();
							$('.menu_top').removeClass('deactive');
							$('#btn_meet').removeClass('deactive');
							$(Signup.modal).modal('hide');
						}
					});
				}
			}else{
				$(Signup.form_id).submit();
			}

		});
	},

	Customscrollbar: function(){
		$(Signup.parent).find('.modal-body').mCustomScrollbar({
			theme:"dark"
		});
	},

	OnBeforeSubmitForm: function(){
		$(Signup.parent).on('beforeSubmit',Signup.form_id,function(e,data,error){
			if(!Signup.zipcode){
				var zip = $(Signup.parent).find('#profile-zip_code').val();
				Signup.CheckZipcode(zip);
				return false;
			}
		});
	},

	OnAfterValidateForm: function(){
		$(Signup.parent).on('afterValidate',Signup.form_id,function(e,data,error){
			if(!Signup.zipcode){
				var zip = $(Signup.parent).find('#profile-zip_code').val();
				Signup.CheckZipcode(zip);
				return false;
			}
		});
	},

	ShowModal: function(){
		$(Signup.parent).modal({
			backdrop: true,
			keyboard: false
		});

		$(Signup.modal).find('.modal-body').mCustomScrollbar({
			theme:"dark"
		});

		Common.centerPositionModal();
	},

	OnChangeGender: function(){
		var gender = $(Signup.parent).find('.sex .dropdown-menu li');
		var input_gender = $(Signup.parent).find('#profile-gender');

		gender.unbind();
		gender.on('click',function(e){
			var text = $(e.currentTarget).text();
			input_gender.val(text);
		});
	},

	OnShowDatePicker: function(){
		var dt = new Date();
		dt.setFullYear(new Date().getFullYear()-18);

		$(Signup.parent).find('.age input').datepicker({
			autoclose: true,
            format: 'yyyy-mm-dd',
            viewMode: "years",
            endDate : dt
        });
	},

	validateZipcode: function(){
		var target = $(Signup.parent).find('#profile-zip_code');

		target.unbind('change');

		target.on('change',function(e){
			Signup.CheckZipcode($(e.currentTarget).val()) ;
		})
	},

	CheckZipcode: function(zipcode){
		var val = parseInt(zipcode,10);
		var message ;

		if(val > 9999 && val < 99999){
			Signup.apiZipcode(val);
		}else if(val ==""){
			message = "Zip Code is invalid";
			Signup.OnShowZipcodeErrors(message);
			Signup.zipcode = 0;
			return false;
		}
		else{
			message = "Zip Code is invalid";
			Signup.OnShowZipcodeErrors(message);
			Signup.zipcode = 0;
			return false;
		}
	},

    apiZipcode: function(zipcode){
    	var message;
        $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+zipcode ,function(data){
        	var address = data.results[0].address_components;
        	var geometry = data.results[0].geometry.location;
        	$.each(address,function(i,e){
				//allow zipcode from united states only
        		if(e.types[0] == 'country' && e.long_name == Signup.country){
        			Signup.zipcode = 1;
	            	Signup.lat = geometry.lat;
	            	Signup.lng = geometry.lng;
					console.log('zipcode lat / lng = '+ Signup.lat+'/'+Signup.lng);
					Signup.OnShowZipcodeValid();
	            	return false;
        		}else{
        			message = "Zip Code is invalid";
	            	Signup.zipcode = 0;
	            	Signup.OnShowZipcodeErrors(message);
        		}
        	});
        });
    },

    OnShowZipcodeValid:function(){
    	var target = $(Signup.parent).find('.zipcode .form-group');
    	target.removeClass('has-error').addClass('has-success');
    	target.find('.help-block').text('');
    	Signup.AddLatLngUser();
    },

    AddLatLngUser: function(){
    	var latIn = $(Signup.parent).find('#profile-lat'),
    		lngIn = $(Signup.parent).find('#profile-lng');

    	latIn.val(Signup.lat);
    	lngIn.val(Signup.lng);
    },

	OnShowZipcodeErrors: function(message){
		var target = $(Signup.parent).find('.zipcode .form-group');
		target.removeClass('has-success').addClass('has-error');
		target.find('.help-block').text(message);
	},

	OnShowModalSignUp: function(){
        $(Signup.modal).on('shown.bs.modal',function(e) {
        	$(Signup.parent).find('input')[1].focus();
        	$(e.currentTarget).unbind();
        	$('.modal-backdrop.in').addClass('active');
        	$('.menu_top').addClass('deactive');
        	$('#btn_meet').addClass('deactive');
        });
	},

	OnHideModalSignUp: function(){
        $(Signup.modal).on('hidden.bs.modal',function(e) {
        	$(e.currentTarget).unbind();
        	$('.menu_top').removeClass('deactive');
        	$('#btn_meet').removeClass('deactive');
        	$(Signup.modal).find(Signup,form_id)[0].reset();
        });
	},

	OnClickLogin: function(){
		var btn = $(Signup.parent).find('.sign-in b');
		btn.unbind();
		btn.on('click',function(){
			Login.initialize();
			$(Signup.parent).modal('hide');
		});
	},
    OnClickBackdrop: function(){
        $('.modal-backdrop.in').unbind();
        $('.modal-backdrop.in').on('click',function(e) {
            $(Signup.parent).modal('hide');
			$('.menu_top').removeClass('deactive');
			$('#btn_meet').removeClass('deactive');
        });
    }
};
console.log('load chat post');
var ChatPost = {
	params:{
		post:'',
		chat_type: '1',
	},
	url:'',
	page:'#post_chat',
	modal:'#modal_chat_post',
	parent: '',
	container: '',
	status_emoji: 1,
	text_message:'',
	message_type:1,
	msg_lenght: 0,
	temp_post: 0,
	initialize: function(){
		ChatPost.SetUrl();
		ChatPost.SetDataPostChat();
		ChatPost.OnClickBackBtn(ChatPost.parent);
		ChatPost.WsConnect(ChatPost.container);
		ChatPost.OnWsChatPost();
		ChatPost.OnWsFilePost();
		ChatPost.HandleWsFilePost();
		ChatPost.GetListEmoji();
		ChatPost.HandleEmoji();
		ChatPost.OnclickLogin();
		if(isMobile){
			ChatPost.SetHeightContainerChat();
			ChatPost.OnClickMeetMobile();
			ChatPost.OnClickChatInboxBtnMobile();
			ChatInbox.HideMeetIconMobile();
		}else{
			ChatPost.ShowChatBox(ChatPost.params.post);
			ChatPost.OnShowModalChatPost();
			ChatPost.ShowModalChatPost();
			ChatPost.OnHideModalChatPost();
			ChatPost.CustomScrollBar();
			ChatPost.OnClickBackdrop();
		}
	},

	ShowChatBox: function(popup_active){
		if (isMobile) {
			if(isGuest){
				$(ChatPost.parent).find('.send_message.login').removeClass('active');
				$(ChatPost.parent).find('.send_message.no-login').addClass('active');
			}else{
				$(ChatPost.parent).find('.send_message.no-login').removeClass('active');
				$(ChatPost.parent).find('.send_message.login').addClass('active');
			}
		} else {
			if(isGuest){
				$(ChatPost.parent).find('.send_message.login').removeClass('active');
				$(ChatPost.parent).find('.send_message.no-login').addClass('active');
			}else{
				$(ChatPost.parent).find('.send_message.no-login').removeClass('active');
				$(ChatPost.parent).find('.send_message.login').addClass('active');
			}
		}
	},

	OnclickLogin: function(){
		var btn = $(ChatPost.parent).find('.send_message.no-login .input-group-addon');

		btn.unbind();
		btn.on('click',function(){
			if(isMobile){
				window.location.href = baseUrl + "/netwrk/user/login?url_callback="+ $(ChatPost.parent).find('.send_message').attr('data-url');
			}else{
				$(ChatPost.parent).modal('hide');
                Login.modal_callback = ChatPost;
                Login.initialize();
                return false;
			}
		});
	},
	GetListEmoji: function(){
		var data = Emoji.GetEmoji();
		var parent = $(ChatPost.parent).find('.emoji .dropdown-menu');
		var template = _.template($( "#list_emoji" ).html());
		var append_html = template({emoji: data});

		if(ChatPost.status_emoji == 1){
			parent.append(append_html);
			parent.mCustomScrollbar({
				theme:"dark"
			});
			ChatPost.ConvertEmoji();
		}

	},

	ConvertEmoji: function(){
		var strs  = $(ChatPost.parent).find('.emoji').find('.dropdown-menu li');
		$.each(strs,function(i,e){
			Emoji.Convert($(e));
			ChatPost.status_emoji = 0;
		});
	},

	HandleEmoji: function(){
		var btn = $(ChatPost.parent).find('.emoji').find('.dropdown-menu li');
		btn.unbind();
		btn.on('click',function(e){
			ChatPost.text_message = $(ChatPost.parent).find('.send_message textarea').val();
			ChatPost.text_message += $(e.currentTarget).attr('data-value') + ' ';
			$(ChatPost.parent).find('textarea').val(ChatPost.text_message);
			$(ChatPost.parent).find('textarea').focus();
		});
	},

	FetchEmojiOne: function(data){
		var messages = $(ChatPost.parent).find(ChatPost.container).find('.message .content_message .content');
		if(data.type === "fetch"){
			$.each(messages,function(i,e){
				Emoji.Convert($(e));
			});
		}else{
			Emoji.Convert(messages.last());
		}
	},

	SetUrl: function(){
		ChatPost.url = MainWs.url;
	},

	SetDataPostChat: function(){
		if(isMobile){
			ChatPost.params.post = $(ChatPost.page).attr('data-post');
			ChatPost.parent = ChatPost.page;
			ChatPost.container = '.container_post_chat';
		}else{
			ChatPost.parent = ChatPost.modal;
			ChatPost.container = '.container_post_chat';
		}
	},

	OnWsChatPost: function(){
		var btn = $(ChatPost.parent).find('.send');
		var formWsChat = $(ChatPost.parent).find('#msgForm');

		formWsChat.on("keydown", function(e){
			if (event.keyCode == 13 && !event.shiftKey) {
				e.preventDefault();
				ChatPost.OnWsSendDataPost(e.currentTarget);
			}
		});
		btn.unbind();
		btn.on("click", function(e){
			ChatPost.OnWsSendDataPost(e.currentTarget);
		});
	},

	OnWsSendDataPost: function(e) {
		var parent = $(e).parent();
		var val	 = parent.find("textarea").val();
		if(val != ""){
			ChatPost.ws.send("send", {"type": 1, "msg": val,"room": ChatPost.params.post,"user_id": UserLogin});
			parent.find("textarea").val("");
			parent.find("textarea").focus();
		}
	},

	ScrollTopChat: function(){
		if(isMobile){
			$(ChatPost.parent).find(ChatPost.container).scrollTop($(ChatPost.parent).find(ChatPost.container)[0].scrollHeight);
		}else{
			$(ChatPost.parent).find('.modal-body').mCustomScrollbar("scrollTo",$(ChatPost.parent).find(ChatPost.container)[0].scrollHeight);
		}
	},

	OnWsFilePost: function(){
		var btn = $(ChatPost.parent).find('#file_btn');
		btn.unbind();
		btn.on("click", function(){
			var btn_input = $(ChatPost.parent).find('#file_upload');
			btn_input.click();
		});
	},

	HandleWsFilePost: function(){
		var parentChat = $(ChatPost.parent);
		var input_change = $(ChatPost.parent).find('#file_upload');
		input_change.unbind('change');
		input_change.change(function(){
			if(typeof input_change[0].files[0] != "undefined"){
				var size_file = input_change[0].files[0].size;
				var type_file = input_change[0].files[0].type;
				var array_type_support = [
						"image/png",
						"image/jpeg",
						"image/pjpeg",
						"image/gif",
						"text/plain",
						"application/msword",
						"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
						"application/excel",
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
						"application/vnd.ms-excel" ,
						"application/x-excel" ,
						"application/x-msexcel",
						"application/mspowerpoint",
						"application/powerpoint",
						"application/vnd.ms-powerpoint",
						"application/x-mspowerpoint",
						"application/vnd.openxmlformats-officedocument.presentationml.presentation",
						"application/pdf",
						"audio/mpeg3",
						"video/mpeg",
						"video/avi",
						"application/x-shockwave-flash",
						"audio/wav, audio/x-wav",
						"application/xml",
						"image/x-icon"
					]
				file = input_change[0].files[0];

				fd = new FormData();
				fd.append('file', file);
				if ((size_file > 12582912) || ($.inArray(type_file, array_type_support) === -1)) {
					alert("Uploaded file is not supported or it exceeds the allowable limit of 12MB.");
					input_change.val('');
				} else {
					$.ajax({
						xhr: function() {
							var xhr = new window.XMLHttpRequest();
							xhr.upload.addEventListener("progress", function(evt) {
								if(evt.lengthComputable) {
									var percentComplete = evt.loaded / evt.total;
									percentComplete = parseInt(percentComplete * 100);
									parentChat.find(".loading_image").css('display', 'block');
								}
							}, false);
							return xhr;
						},
						url:  baseUrl + "/netwrk/chat/upload",
						type: "POST",
						data: fd,
						processData: false,
						contentType: false,
						success: function(result) {
							var fileForm = $(ChatPost.parent).find('#msgForm');
							val  = fileForm.find("textarea").val();
							if(result != "" && result !== false){
								var result = $.parseJSON(result);
								ChatPost.ws.send("send", {"type" : result.type, "msg" : val, "file_name" : result.file_name,"room": ChatPost.params.post,"user_id": UserLogin});
								parentChat.find(".loading_image").css('display', 'none');
								fileForm.find("textarea").val('');
							}
						}
					});
				}

			}
		});
	},

	WsConnect: function(parent){

		ChatPost.ws = $.websocket(ChatPost.url+"/?post="+ChatPost.params.post+"&user_id="+UserLogin+"&chat_type="+ChatPost.params.chat_type, {
			open: function(data) {
				$(ChatPost.parent).find('textarea').focus();
			},
			close: function() {
			},
			events: {
				fetch: function(e) {
					ChatPost.msg_lenght = e.data.length;
					$.each(e.data, function(i, elem){
						ChatPost.getMessageTemplate(elem);
						ChatPost.ScrollTopChat();
					});
					/*if(isMobile){
						fix_width_chat_post($(ChatPost.parent).find('.content_message'),$($(ChatPost.parent).find('.message')[0]).find('.user_thumbnail').width() + 50);
					}*/
					ChatPost.FetchEmojiOne({type: 'fetch'});
				},
				onliners: function(e){
				},
				single: function(e){
					var update_list_chat;
					$.each(e.data, function(i, elem){
						if(ChatPost.params.post == elem.post_id){
							ChatPost.message_type = elem.msg_type;
							ChatPost.getMessageTemplate(elem);
							update_list_chat = $.parseJSON(elem.update_list_chat);
						}
					});
					/*if(isMobile){
						fix_width_chat_post($(ChatPost.parent).find('.content_message'),$($(ChatPost.parent).find('.message')[0]).find('.user_thumbnail').width() + 50);
					}*/
					if(!isMobile) {
						ChatInbox.getTemplateChatInbox($("#chat_inbox").find('#chat_discussion ul'), update_list_chat);
					}
					if(ChatPost.message_type == 1){
						ChatPost.FetchEmojiOne({type: 'single'});
					}
					ChatPost.ScrollTopChat();
				}
			}
		});
	},

	getMessageTemplate:function(data){
		var template = _.template($( "#message_chat" ).html());
		var append_html = template({msg: data,baseurl: baseUrl});

		$(ChatPost.parent).find(ChatPost.container).append(append_html);
		ChatPost.OnClickParticipantAvatarMobile();
	},

	RedirectChatPostPage: function(postId, chat_type, previous_flag){
		if (chat_type == 0) {
			window.location.href = baseUrl + "/netwrk/chat-private/?post="+ postId +"&chat_type="+chat_type+"&previous-flag=" + previous_flag;
		} else {
			window.location.href = baseUrl + "/netwrk/chat/chat-post?post="+ postId +"&chat_type="+chat_type+"&previous-flag=" + previous_flag;
		}
	},

	SetHeightContainerChat: function(){
		var size = get_size_window();
		var h_navSearch = $('.navbar-mobile').height();
		var h_header = $(ChatPost.page).find('.header').height();
		var btn_meet = $('#btn_meet_mobile').height()-10;
		var nav_message = $(ChatPost.page).find('.nav_input_message').height();
		var nav_bottom = $('.navigation-wrapper').height();
		var wh = size[1] - h_navSearch -h_header - btn_meet - nav_message;

		$(ChatPost.page).find('.container_post_chat').css('height',wh);
	},

	OnClickBackBtn: function(){

		var BackBtn = $(ChatPost.parent).find('.back_page').add($('.box-navigation .btn_nav_map'));
		BackBtn.unbind();
		BackBtn.on('click',function(){
			if(isMobile){
				Post.RedirectPostPage($(ChatPost.parent).attr('data-topic'));
			}else{
				Post.initialize();
				$(ChatPost.parent).modal('hide');
			}
		});
	},

	GetSearchParam: function(url) {
		var query_string = {};
		var query = url.substring(1);
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
		    var pair = vars[i].split("=");
		        // If first entry with this name
		    if (typeof query_string[pair[0]] === "undefined") {
		      query_string[pair[0]] = decodeURIComponent(pair[1]);
		        // If second entry with this name
		    } else if (typeof query_string[pair[0]] === "string") {
		      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
		      query_string[pair[0]] = arr;
		        // If third or later entry with this name
		    } else {
		      query_string[pair[0]].push(decodeURIComponent(pair[1]));
		    }
		}
	    return query_string;
	},

	OnClickBackdrop: function(){
		$('.modal-backdrop.in').unbind();
		$('.modal-backdrop.in').on('click',function(e) {
			$(ChatPost.modal).modal('hide');
		});
	},

	CustomScrollBar: function(){
		var parent = $(ChatPost.modal).find('.modal-body');
		parent.mCustomScrollbar({
			theme:"dark"
		});
	},

	ShowModalChatPost: function(){
		var height_footer = $(ChatPost.modal).find('.modal-footer').height();
		set_container_chat_modal($(ChatPost.modal),height_footer);

		$(ChatPost.modal).modal({
			backdrop: true,
			keyboard: false
		});
	},

	OnShowModalChatPost: function(){
		$(ChatPost.modal).on('shown.bs.modal',function(e) {
			$(e.currentTarget).unbind();
			ChatPost.GetNameChatPost();
		});
	},

	OnHideModalChatPost: function(){
		$(ChatPost.modal).on('hidden.bs.modal',function(e) {
			$(e.currentTarget).unbind();
			ChatPost.ResetModalChatPost();
		});
	},

	ResetModalChatPost: function(){
		$(ChatPost.modal).find('.title_page .title').empty();
		$(ChatPost.modal).find(ChatPost.container).empty();
		ChatPost.ws.close();
		ChatPost.ws = null;
		ChatPost.temp_post = 0;
	},

	GetNameChatPost: function(){
		var parent = $(ChatPost.parent).find('.title_page .title');
		Ajax.chat_post_name(ChatPost.params).then(function(data){
			var json = $.parseJSON(data);
			ChatPost.getNameTemplate(parent,json)
		})
	},

	getNameTemplate: function(parent,data){
		var self = this;
		var list_template = _.template($("#chatpost_name" ).html());
		var append_html = list_template({name: data});

		parent.append(append_html);
	},

	OnClickMeetMobile: function(){
		var target = $('.navbar-mobile').find('.menu_bottom #btn_meet_mobile');
		target.on('click', function(){
			window.location.href = baseUrl + '/netwrk/meet';
		});
	},

	OnClickChatInboxBtnMobile: function() {
		var target = $('#chat_inbox_btn_mobile');
        target.unbind();
        target.on('click',function(){
        	sessionStorage.url = window.location.href;
            ChatInbox.OnClickChatInboxMobile();
            // Ajax.set_previous_page(window.location.href).then(function(data){
            //     ChatInbox.OnClickChatInboxMobile();
            // });
        });
		// ChatInbox.OnClickChatInboxBtnMobile();
	},

	OnClickParticipantAvatarMobile: function(){
		var avatar = $(ChatPost.page).find('.container_post_chat .user_thumbnail'),
			user = $(ChatPost.page).attr('data-user-login');
		avatar.unbind();
		avatar.on('click', function(e){
			var user_id = $(e.currentTarget).attr('data-user-id');
			if (user_id != user){
				window.location.href = baseUrl + "/netwrk/meet?user_id=" + user_id + "&from=discussion";
			}
		});
	},

}

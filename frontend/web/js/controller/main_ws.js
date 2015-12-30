var MainWs ={
    url: '',
    userLogin: '',
    ws: '',
    initialize: function() {
        MainWs.setUrl();
        window.connect = MainWs.wsConnect(UserLogin);
    },

    setUrl: function(){
        if(baseUrl === 'http://netwrk.rubyspace.net'){
            MainWs.url = 'box.rubyspace.net';
        }else{
            MainWs.url = window.location.host;
        };
    },

    wsConnect: function(user_id){
        window.ws = $.websocket("ws://"+MainWs.url+":2311?user_id=" + user_id, {
            open: function(e) {
                console.log('Open');
                // handle when socket is opened
            },
            close: function() {
                console.log('Close');
                // handle when connection close
            },
            events: {
                fetch: function(e) {
                    console.log('fetch');
                    PopupChat.msg_lenght = e.data.length;
                    if (PopupChat.close_status == 0) {
                        $.each(e.data, function(i, elem){
                            PopupChat.getMessageTemplate(elem);
                            PopupChat.ScrollTopChat(elem.post_id);
                        });
                        if(isMobile){
                            fix_width_chat_post($(PopupChat.parent).find('.content_message'),$($(PopupChat.parent).find('.message')[0]).find('.user_thumbnail').width() + 50);
                        }
                        PopupChat.FetchEmojiOne({type: 'fetch'}, PopupChat.params.post);
                    }
                },
                onliners: function(e){
                    console.log('Onliner');
                },
                single: function(e){
                    console.log('single');
                    // handle of chat
                    var update_list_chat;
                    var popup_active = e.data[0]['post_id'];
                    var user_id = e.data[0]['id'];
                    var chat_type = e.data[0]['chat_type'];
                    $.each(e.data, function(i, elem){
                        PopupChat.message_type = elem.msg_type;
                        PopupChat.getMessageTemplate(elem);
                        update_list_chat = $.parseJSON(elem.update_list_chat);
                    });
                    if(isMobile){
                        fix_width_chat_post($(PopupChat.parent).find('.content_message'),$($(PopupChat.parent).find('.message')[0]).find('.user_thumbnail').width() + 50);
                    } else {
                        if (chat_type == 0) {
                            ChatInbox.getTemplateChatPrivate($("#chat_inbox").find('#chat_private ul'), update_list_chat, user_id);
                        } else {
                            ChatInbox.getTemplateChatInbox($("#chat_inbox").find('#chat_discussion ul'), update_list_chat, user_id);
                        }
                    }
                    if(PopupChat.message_type == 1){
                        PopupChat.FetchEmojiOne({type: 'single'}, popup_active);
                    }
                    PopupChat.ScrollTopChat(popup_active);
                },
                notify: function(e){
                    // handle notify
                }
            }
        });

    }
};
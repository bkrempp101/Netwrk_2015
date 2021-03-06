var getMaxMarkerXHR,
    getTopicMarkerXHR,
    getLineMarkerXHR;
var Ajax = {
    cover_search: function(params){
        var url,defer = $.Deferred();
        url = baseUrl + "/netwrk/search/cover-search";

        $.ajax({
            url: url,
            data: params,
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    top_landing: function(params){
        var url,defer = $.Deferred();
        url = baseUrl + "/netwrk/default/feed-global";

        $.ajax({
            url: url,
            data: params,
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    getLocalNearByLines: function() {
        var url,defer = $.Deferred();
        url = baseUrl + "/netwrk/post/get-local-near-by-lines";

        $.ajax({
            url: url,
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    getFeedsBySelectedZipCode: function() {
        var url,defer = $.Deferred();
        url = baseUrl + "/netwrk/default/get-feeds-by-selected-zip-code";

        $.ajax({
            url: url,
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    global_search: function(params){
        var url,defer = $.Deferred();
        url = baseUrl + "/netwrk/search/global-search";

        $.ajax({
            url: url,
            data: params,
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    reset_password: function(params){
        var url,defer = $.Deferred();
        url = baseUrl + "/netwrk/user/user-reset-password";

        $.ajax({
            url: url,
            data: params,
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    forgot_password: function(form){
        var url,defer = $.Deferred();
        url = baseUrl + "/netwrk/user/forgot-password";

        $.ajax({
            url: url,
            data: $(form).serialize(),
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    user_signup: function(form){
        var url,defer = $.Deferred();
        url = baseUrl + "/netwrk/user/signup-user";

        $.ajax({
            url: url,
            data: $(form).serialize(),
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    update_profile_info: function(form){
        var url,defer = $.Deferred();
        url = baseUrl + "/netwrk/profile/update-social-profile-info";

        $.ajax({
            url: url,
            data: $(form).serialize(),
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    user_join: function(form, key){
        var url,defer = $.Deferred();
        url = baseUrl + "/netwrk/user/join?key="+key;

        $.ajax({
            url: url,
            data: $(form).serialize(),
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    user_login: function(form){
        var url,defer = $.Deferred();
        url = baseUrl + "/netwrk/user/login-user";

        $.ajax({
            url: url,
            data: $(form).serialize(),
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    chat_post_name: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/chat/chat-name";

        $.ajax({
            url: url,
            data: params,
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    vote_post: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/post/vote-post";

        $.ajax({
            url: url,
            data: params,
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    get_topic: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/topic/get-topic";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    get_topic_by_city: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/topic/get-topic-by-city";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    update_view_topic: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/topic/update-view-topic";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    update_view_post: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/post/update-view-post";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    update_view_post_content: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/post/update-view-post-content";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    get_post_by_topic:function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/post/get-all-post";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getStreamByTopic:function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/post/get-stream";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    get_position_user: function(){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/default/get-user-position";

        $.ajax({
            url: url,
            // data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    get_top_post: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/default/get-top-post";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    check_zipcode_exist: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/default/check-exist-zipcode";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    place_check_zipcode_exist: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/default/check-exist-place-zipcode";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    get_marker_default: function(){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/default/get-maker-default-zoom";

        $.ajax({
            url: url,
            // data: params,
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();

    },

    get_marker_zoom: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/default/get-maker-max-zoom";

        getMaxMarkerXHR = $.ajax({
            url: url,
            data: params,
            async: true,
            cache: false,
            type: 'POST',
            beforeSend : function() {
                if(getMaxMarkerXHR && getMaxMarkerXHR.readyState != 4) {
                    getMaxMarkerXHR.abort();
                }
            },
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();

    },

    get_marker_info: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/default/get-marker-info";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();

    },

    show_topic: function(params){
        var url,defer = $.Deferred();

        if (isMobile) {
            url = baseUrl +"/netwrk/topic/get-topic-mobile";
        }else{
            url = baseUrl + "/netwrk/topic/get-topic-mobile";
        }

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    show_feed: function(params){
        var url,defer = $.Deferred();

        if (isMobile) {
            url = baseUrl +"/netwrk/topic/get-feed";
        }else{
            url = baseUrl + "/netwrk/topic/get-feed";
        }

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    get_marker_groups_loc: function(params){
        var url,defer = $.Deferred();

        //url = baseUrl + "/netwrk/default/get-groups-loc" + (groupId != null ? "?groupId="+groupId : "")+""+(params != null ? "&params="+params : "") +"";
        url = baseUrl + "/netwrk/default/get-groups-loc";
        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();

    },
    get_marker_topic_loc: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/topic/get-topic-by-location";

        getTopicMarkerXHR = $.ajax({
            url: url,
            data: params,
            async: true,
            cache: false,
            type: 'POST',
            beforeSend : function() {
                if(getTopicMarkerXHR && getTopicMarkerXHR != 4) {
                    getTopicMarkerXHR.abort();
                }
            },
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    get_marker_line_loc: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/post/get-post-by-location";

        getLineMarkerXHR = $.ajax({
            url: url,
            data: params,
            async: true,
            cache: false,
            type: 'POST',
            beforeSend : function() {
                if(getLineMarkerXHR && getLineMarkerXHR != 4) {
                    getLineMarkerXHR.abort();
                }
            },
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    show_groups: function(params){
        var url,defer = $.Deferred();

        url = "/netwrk/group/get-groups";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    show_group: function(id) {
        var url,defer = $.Deferred();

        url = "/netwrk/group/get-group";

        $.ajax({
            url: url,
            data: { "id" : id },
            type: 'POST',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    show_post: function(post_id) {
        var url,defer = $.Deferred();

        url = "/netwrk/post/get-post-by-id";

        $.ajax({
            url: url,
            data: { "post_id" : post_id },
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    show_topic_by_id: function(topic_id) {
        var url,defer = $.Deferred();

        url = "/netwrk/topic/get-topic-by-id";

        $.ajax({
            url: url,
            data: { "topic_id" : topic_id },
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    create_edit_group: function(params){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/group/create-edit-group";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            // contentType: false,
            // processData: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    delete_group: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/group/delete-group";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            // contentType: false,
            // processData: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getUserMeeting: function(params){
        var url = baseUrl +"/netwrk/meet/get-user-meet",
            defer = $.Deferred();

        if (isMobile) {
            params = {'view' : 'mobile'};
        }else{
            params = {'view' : 'desktop'};
        }

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    usermeet: function(params){
        var url,defer = $.Deferred();

        if (isMobile) {
            url = baseUrl +"/netwrk/meet/user-meet";
        }else{
            url = baseUrl +"/netwrk/meet/user-meet";
        }

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: true,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    usermet: function(params){
        var url,defer = $.Deferred();

        if (isMobile) {
            url = baseUrl + "/netwrk/meet/user-met";
        }else{
            url = baseUrl +"/netwrk/meet/user-met";
        }

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: true,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    // TODO : Need to remove from this after completion on profile task
    userprofile: function(){
        var url,defer = $.Deferred();

        // if (isMobile) {
        url = baseUrl + "/netwrk/setting/load-profile";
        // }else{
        //     url = "netwrk/meet/get-user-meet";
        // }

        $.ajax({
            url: url,
            // data: params,
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    update_profile: function(params){
        var url,defer = $.Deferred();

        // if (isMobile) {
        url = baseUrl +"/netwrk/setting/update-profile";
        // }else{
        // url = "netwrk/meet/get-user-meet";
        // }

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    upload_image:function(params){
        var url,defer = $.Deferred();
//
        // if (isMobile) {
        url = baseUrl +"/netwrk/setting/upload-image";
        // }else{
        // url = "netwrk/meet/get-user-meet";
        // }

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    get_setting: function(params){
        var url,defer = $.Deferred();

        // if (isMobile) {
        url = baseUrl +"/netwrk/setting/get-user-setting";
        // }else{
        // url = "netwrk/meet/get-user-meet";
        // }

        $.ajax({
            url: url,
            // data: params,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    update_setting: function(params){
        var url,defer = $.Deferred();

        // if (isMobile) {
        url = baseUrl +"/netwrk/setting/update-user-setting";
        // }else{
        // url = "netwrk/meet/get-user-meet";
        // }//

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            // contentType: false,
            // processData: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    // TODO : Need to remove upto this after completion on profile task

    getUserProfile: function(){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/profile/get-profile";

        $.ajax({
            url: url,
            // data: params,
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    updateUserProfile: function(params){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/profile/update-profile";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    uploadProfileImage:function(params){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/profile/upload-image";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    passwordSetting: function(form){
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/profile/password-setting";

        $.ajax({
            url: url,
            data: $(form).serialize(),
            async: true,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getSearchSetting: function(params){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/setting/get-user-setting";

        $.ajax({
            url: url,
            // data: params,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    updateSearchSetting: function(params){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/setting/update-user-setting";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            // contentType: false,
            // processData: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getProfileBasicInfo: function(){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/profile/get-profile-basic-info";

        $.ajax({
            url: url,
            // data: params,
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    updateProfileEdit: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/profile/update-profile-edit";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    updateProfileMeetInfo: function(params){
        var url,defer = $.Deferred();

        url = baseUrl + "/netwrk/profile/update-profile-meet-info";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    new_topic: function(params){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/topic/new-topic";

        $.ajax({
         url: url,
         data: params,
         async: false,
         cache: false,
         // contentType: false,
         // processData: false,
         type: 'POST',
         success: defer.resolve,
         error: defer.reject
         });

        return defer.promise();
    },

    new_post: function(params){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/post/new-post";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            // contentType: false,
            // processData: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    new_place: function(params){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/default/place-save";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            // contentType: false,
            // processData: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    list_chat_post: function(){
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/post/get-chat-inbox";

        $.ajax({
            url: url,
            data: null,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    get_chat_private_list: function(user_id) {
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/chat-private/get-chat-private-list";

        $.ajax({
            url: url,
            data: {'user_id': user_id},
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    get_user_met_profile: function(chat_post_id){
        var url,defer = $.Deferred();
        if (isMobile) {
            url = baseUrl +"/netwrk/meet/get-user-meet-profile";
        }else{
            url = baseUrl + "/netwrk/meet/get-user-meet-profile";
        }

        $.ajax({
            url: url,
            data: {'post_id': chat_post_id},
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    get_user_met_profile_discussion: function(user_view){
        var url,defer = $.Deferred();
        if (isMobile) {
            url = baseUrl +"/netwrk/meet/get-user-meet-profile-discussion";
        }else{
            url = baseUrl + "/netwrk/meet/get-user-meet-profile-discussion";
        }

        $.ajax({
            url: url,
            data: {'user_view': user_view},
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    get_users: function(group_id) {
        var url,defer = $.Deferred();

        url = "/netwrk/group/get-users";

        $.ajax({
            url: url,
            data: { "id" : group_id },
            type: 'POST',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    count_unread_message: function(){
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/notify/count-unread-message";

        $.ajax({
            url: url,
            data: null,
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    count_unread_msg_from_user: function(sender){
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/notify/count-unread-msg-from-user";

        $.ajax({
            url: url,
            data: {'sender': sender},
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    update_notification_status: function(sender){
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/notify/change-status-unread-msg";

        $.ajax({
            url: url,
            data: {'sender': sender},
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },
    update_discussion_notification_status: function(user_id, post_id){
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/notify/change-status-unread-discussion-msg";

        $.ajax({
            url: url,
            data: {'user_id': user_id, 'post_id': post_id},
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    change_chat_show_message: function(){
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/notify/update-chat-show-status";

        $.ajax({
            url: url,
            data: null,
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    /**
     * [Function is used to get ajax user profile]
     * @return             [data json]
     */

    get_user_profile: function(){
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/default/get-user-profile";

        $.ajax({
            url: url,
            data: null,
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    get_info_post: function(post_id) {
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/post/get-info-post";

        $.ajax({
            url: url,
            data: {'post_id': post_id},
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    insert_local_university: function() {
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/default/insert-local-university";

        $.ajax({
            url: url,
            data: null,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    insert_local_government: function() {
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/default/insert-local-government";

        $.ajax({
            url: url,
            data: null,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    get_marker_update: function(city) {
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/default/get-marker-update";

        $.ajax({
            url: url,
            data: {'city': city},
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    redirect_cover_page: function(){
        var url,defer = $.Deferred();
        url = baseUrl + "/netwrk/default/home";

        $.ajax({
            url: url,
            data: null,
            async: true,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    /**
     * GET LOCATION of HELP
     */
    get_marker_help: function() {
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/default/get-marker-help";

        $.ajax({
            url: url,
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    },

    show_user_topics: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/topic/get-topics-by-user";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    show_user_posts: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/post/get-posts-by-user";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    favorite: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/favorite/favorite";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    favorite_home_community: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/favorite/favorite-home-zipcode";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    show_user_favorite_communities: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/favorite/get-favorite-communities-by-user";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    show_user_joined_communities: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/favorite/get-joined-communities-by-user";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    show_user_recent_communities: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/log/get-recent-communities-by-user";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    show_user_groups: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/group/get-groups-by-user";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    set_cover_cookie: function(zip_code){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/default/set-cover-cookie";

        $.ajax({
            url: url,
            data: zip_code,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    setSelectedZipCodeCookie: function(params){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/default/set-selected-zip-code-cookie";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    set_welcome_cookie: function(){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/default/set-welcome-cookie";

        $.ajax({
            url: url,
            data: '',
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    setUserLocationInfoCookie: function(zip_code){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/default/set-user-location-info-cookie";

        $.ajax({
            url: url,
            data: '',
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    create_log: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/log/create";

        $.ajax({
            url: url,
            data: params,
            type: 'POST',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    delete_log: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/log/delete";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    get_city_by_id: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/default/get-city-by-id";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    get_city_by_zipcode: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/default/get-city-by-zipcode";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    get_topics_by_zipcode: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/topic/get-topics-by-zipcode";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },
    getZipBoundaries: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/default/get-zip-boundaries";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getVisibleZipBoundaries: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/default/get-visible-zip-boundaries";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getSingleZipBoundaries: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/default/get-single-zip-boundaries";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getZipWeatherData: function(params) {
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/api/get-zip-weather-data";
        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    deletePost: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/post/delete";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            // contentType: false,
            // processData: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    deleteTopic: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/topic/delete";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            // contentType: false,
            // processData: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getBrilliantPostsFromZip: function(params) {
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/default/get-brilliant-posts-from-zip";
        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    postFeedback: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/feedback/post";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    setGlowCookie: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/default/set-glow-cookie";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getUserById: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/default/get-user-by-id";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getCommunitiesCountFromZip: function(params) {
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/default/get-communities-count-from-zip";
        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getOnBoardDetails: function(){
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/post/get-on-board-details";

        $.ajax({
            url: url,
            data: null,
            async: false,
            cache: false,
            type: 'GET',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    saveOnBoardingLines: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/post/save-on-boarding-lines";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getPostLocation: function(params) {
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/post/get-post-location";

        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getBuildDetailFromZip: function(params) {
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/default/get-build-detail-from-zip";
        $.ajax({
            url: url,
            data: params,
            type: 'GET',
            async: false,
            cache: false,
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    postMessage: function(params){
        var url,defer = $.Deferred();

        url = baseUrl +"/netwrk/post/new-message";

        $.ajax({
            url: url,
            data: params,
            async: false,
            cache: false,
            // contentType: false,
            // processData: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    },

    getMessagePostDetails: function(){
        var url,defer = $.Deferred();
        url = baseUrl +"/netwrk/post/message-post-details";

        $.ajax({
            url: url,
            data: null,
            async: false,
            cache: false,
            type: 'POST',
            success: defer.resolve,
            error: defer.reject
        });

        return defer.promise();
    }
};


var Create_Topic={
    params:{
        topic_id: '',
        topic:'',
        post: '',
        message:'',
        city:null,
        city_name:'',
        group:null,
        group_name:null,
        byGroup:false,
        byGroupLoc:false,
        netwrk_name:'',
        zip_code:'',
        lat:'',
        lng:'',
        post_id:'',
        post_title:'',
        post_content:''
    },
    status_change:{
        topic:false,
        post: false,
        message: false,
        total: false
    },

    initialize: function(city, name, byGroup, group, groupName, byGroupLoc, topic_id){
        if (typeof byGroup != "undefined") Create_Topic.params.byGroup = byGroup;
        if (typeof byGroupLoc != "undefined") Create_Topic.params.byGroupLoc = byGroupLoc;

        if(isMobile){
            Create_Topic.modal = $('#create_topic');

            Create_Topic.params.city = Create_Topic.modal.attr('data-city');
            Create_Topic.params.netwrk_name = Create_Topic.modal.attr('data-name-city');
            Create_Topic.params.zip_code = Create_Topic.modal.attr('data-zipcode');
            Create_Topic.params.lat = Create_Topic.modal.attr('data-lat');
            Create_Topic.params.lng = Create_Topic.modal.attr('data-lng');
            Create_Topic.params.group = Create_Topic.modal.attr('data-group');
            Create_Topic.params.group_name = Create_Topic.modal.attr('data-group-name');
            Create_Topic.params.byGroup = Create_Topic.modal.attr('data-by-group');
            Create_Topic.params.isCreateFromBlueDot = Create_Topic.modal.attr('data-isCreateFromBlueDot');

            if(Create_Topic.params.isCreateFromBlueDot == 'true') {
                Create_Topic.onChangeMobileCommunityCategory();
            }

            //if edit topic form, then fetch data from topic id and initialize the topic form
            Create_Topic.params.topic_id = $('#create_topic').attr('data-topic_id');
            if(Create_Topic.params.topic_id) {
                Create_Topic.params.post_id = $('#create_topic').find('.name_post').attr('data-post_id');
                Create_Topic.status_change.topic = true;
                Create_Topic.status_change.post = true;
                Create_Topic.status_change.message = true;
                //make save button active as topic is edited and all required fields are populated.
                Create_Topic.onCheckStatus();
            }

            Create_Topic.changeData();
            Create_Topic.onclickBack();
            // Create_Topic.showNetWrkBtn();
            Create_Topic.eventClickMeetMobile();
            Create_Topic.postTitleFocus();
            Create_Topic.OnClickChatInboxBtnMobile();
            Default.SetAvatarUserDropdown();
        }else{
            Create_Topic.modal = $('#create_topic_modal');
            if(isGuest){
                if(!Login.modal_callback){
                    Login.modal_callback = Topic;
                }
                Login.initialize();
                return false;
            }
            //if edit form of create topic
            if(topic_id != 'undefined' && topic_id != null) {
                Create_Topic.params.topic_id = topic_id;
                //fetch topic details with post and show data on create topic form.
                var error = false;
                Ajax.show_topic_by_id(topic_id).then(function(data) {
                    var json = $.parseJSON(data);
                    if (json.error) {
                        alert("Unable to load post");
                        error = true;
                    } else {
                        //If post is exists of perticular post_id then set the post params. So
                        //these params are available for furthur processing.
                        city = json.city_id;
                        name = json.city_name;

                        Create_Topic.params.topic_id = json.topic_id;
                        Create_Topic.params.topic_name = json.topic_title;
                        Create_Topic.params.city = json.city_id;
                        Create_Topic.params.zip_code = json.zip_code;
                        Create_Topic.params.post_id = json.post_id;
                        Create_Topic.params.post_title = json.post_title;
                        Create_Topic.params.post_content = json.content;

                        //set status_change status as true So save button will be active in create post form
                        // as post msg and message required field is alread updated.
                        Create_Topic.status_change.topic = true;
                        Create_Topic.status_change.post = true;
                        Create_Topic.status_change.message = true;
                    }

                });
                if (error) return;
            }
            if(city && name){
                Create_Topic.params.city = city;
                Create_Topic.params.city_name = name;
            }
            if (byGroup) {
                Create_Topic.params.group = group;
                Create_Topic.params.group_name = groupName;
            }
            console.log("params: ", Create_Topic.params, byGroup);

            //if topic creats from blue dot. It means name = city name, and city id = null
            if (name && city == null) {
                Create_Topic.showGroupCategory(name);
                Create_Topic.onChangeGroupCategory();
                Create_Topic.params.city_name = name;
                Create_Topic.params.lat = $('#create_topic_modal').attr('data-lat');
                Create_Topic.params.lng = $('#create_topic_modal').attr('data-lng');
                Create_Topic.params.isCreateFromBlueDot = true;
            }

            Create_Topic.showModalCreateTopic();
            // Create_Topic.showSideBar();
            Create_Topic.onCloseModalCreateTopic();
            Create_Topic.changeData();
            Create_Topic.onclickBack();
            // Create_Topic.showNetWrkBtn();
            Create_Topic.eventClickdiscover();
            Create_Topic.postTitleFocus();
            Create_Topic.showZipcodeBreadcrumb(Create_Topic.params.city_name);
            Create_Topic.onClickBackZipcodeBreadcrumb();
            Create_Topic.onClickBackNetwrkLogo();
            Topic.displayPositionModal();
        }
    },
    showCreateTopicModal: function(zipcode, lat, lng) {
        var parent = $('#create_topic_modal');
        parent.attr('data-lat', lat);
        parent.attr('data-lng', lng);

        if(isMobile) {
            if(zipcode){
                window.location.href = baseUrl + "/netwrk/topic/create-topic?city=null&zipcode="+zipcode+"&name=null&lat="+lat+"&lng="+lng+"&isCreateFromBlueDot=true";
            }
        } else {
            Create_Topic.initialize(null, zipcode);
        }
    },
    /* Display community category dropdown on Create Group modal. */
    showGroupCategory: function(zipcode){
        var parent = $('#create_topic_modal');
        parent.find('.group-category-content').html('');
        var params = {'zip_code': zipcode};
        //todo: fetch weather api data
        Ajax.get_city_by_zipcode(params).then(function(data){
            var json = $.parseJSON(data);
            console.log(json);
            Create_Topic.getTemplateGroupCategory(parent,json);
        });
    },
    getTemplateGroupCategory: function(parent,data){
        var json = data;
        var target = parent.find('.group-category-content');

        var list_template = _.template($("#group-category-template").html());
        var append_html = list_template({data: json});

        target.append(append_html);
    },
    //update Create_Topic.params.city variable on change of group category dropdown in create topic form.
    onChangeGroupCategory: function() {
        var parent = $('#create_topic_modal').find('.dropdown-office');
        var city_id = parent.val();

        parent.unbind();
        parent.on('change', function(){
            city_id = $(this).val();
            Create_Topic.params.city = city_id;
        });

        Create_Topic.params.city = city_id;
    },
    //on change of topic category dropdown, update post params
    onChangeMobileCommunityCategory: function() {
        var parent = $('#create_topic').find('.dropdown-office');
        var city_id = parent.val(),
            city_name = parent.find(':selected').attr('data-name-city');

        parent.unbind();
        parent.on('change', function(){
            city_id = $(this).val();
            city_name = $(this).find(':selected').attr('data-name-city');

            Create_Topic.params.city = city_id;
            Create_Topic.params.netwrk_name = city_name;

            $('#create_topic').attr('data-city', city_id);
            $('#create_topic').attr('data-name-city', city_name);

            console.log(Create_Topic.params.city );
            console.log(Create_Topic.params.netwrk_name);
        });

        if(Create_Topic.params.isCreateFromBlueDot == 'true') {
            Create_Topic.params.netwrk_name = city_name;
            Create_Topic.params.city = city_id;
        }
    },
    showZipcodeBreadcrumb: function(zipcode){
        var target = Create_Topic.modal.find('.scrumb .zipcode');
        target.html(zipcode);
    },
    postTitleFocus: function(){
        $('.name_post').focus(function(){
            $('.input-group').addClass('clsFocus');
        });
        $('.name_post').focusout(function(){
            $('.input-group').removeClass('clsFocus');
        });
    },
    eventClickdiscover: function(){
        var parent = Create_Topic.modal,
            target = parent.find('#btn_discover');
            target.unbind();
            target.on('click',function(){
                parent.modal('hide');
            });
    },
    eventClickMeetMobile: function(){
        // var target = $('#btn_discover_mobile');
        var target = $('#btn_meet_mobile');
        target.unbind();
        target.on('click',function(){
            target.bind();
            window.location.href = baseUrl + "/netwrk/meet";
            // Meet.reset_page();
            // Meet._init();
        });
    },

    showNetWrkBtn: function(){
        var parent = Create_Topic.modal;
        if(isMobile){
            // if(Create_Topic.modal.size()>0){
            //     $('#btn_meet_mobile').hide();
            //     $('#btn_discover_mobile').show();
            // }
        }else{
            $('#btn_meet').hide();
            set_position_btn(parent,parent.find('#btn_discover'),130,100);
            set_position_btn_resize(parent,parent.find('#btn_discover'),130,100);
        }
    },

    hideNetWrkBtn: function(){
        var parent = Create_Topic.modal;
        if(isMobile){
            // $('#btn_meet_mobile').show();
            // $('#btn_discover_mobile').hide();
        }else{
            $('#btn_meet').show();
            parent.find('#btn_discover').hide();
        }

    },

    showSideBar: function(){
        var sidebar = $('.map_content .sidebar');
        var city_name = "<span>"+ Create_Topic.params.city_name +"</span>";

        sidebar.find('.container').append(city_name);
        sidebar.show();
    },

    hideSideBar: function(){
        var sidebar = $('.map_content .sidebar');

        sidebar.find('.container span').remove();
        sidebar.hide();
    },

    showModalCreateTopic: function(){
        var parent = Create_Topic.modal;

        parent.find('.name_topic').val(Create_Topic.params.topic_name);
        parent.find('.name_post').val(Create_Topic.params.post_title);
        parent.find('.message').val(Create_Topic.params.post_content);

        Create_Topic.onCheckStatus();
        
        Common.CustomScrollBar(parent.find('.modal-body'));

        parent.modal({
            backdrop: true,
            keyboard: false
        }).removeAttr("style").css("display", "block");
    },

    onCloseModalCreateTopic: function(){
        Create_Topic.modal.on('hidden.bs.modal',function() {
            Create_Topic.hideModalCreateTopic();
        });
        $('.modal-backdrop.in').click(function(e) {
            Create_Topic.hideModalCreateTopic();
        });
    },

    hideModalCreateTopic:function(){
        var parent = Create_Topic.modal;
        Create_Topic.reset_data();
        Create_Topic.setDefaultBtn();
        // Create_Topic.hideSideBar();
        Create_Topic.hideNetWrkBtn();
        parent.modal('hide');

    },

    onclickBack: function(){
        var parent = Create_Topic.modal.find('.back_page span').add($('.box-navigation .btn_nav_map'));
        var city = Create_Topic.params.city;
        var params = {zipcode: Create_Topic.params.city_name};
        parent.unbind();
        parent.click(function(){
            if(isMobile){
                Create_Topic.redirect();
            }else{
                Create_Topic.hideModalCreateTopic();
                Topic.initialize(city,params);
            }
        });
    },
    onClickBackZipcodeBreadcrumb: function(){
        var parent = Create_Topic.modal.find('.scrumb .zipcode');
        var city = Create_Topic.params.city;
        var params = {zipcode: Create_Topic.params.city_name};
        parent.unbind();
        parent.click(function(){
            if(isMobile){
                Create_Topic.redirect();
            }else{
                Create_Topic.hideModalCreateTopic();
                Topic.initialize(city,params);
            }
        });
    },
    onClickBackNetwrkLogo: function(){
        $('#create_topic_modal .scrumb .logo').click(function(){
            Create_Topic.modal.modal('hide');
        });
    },
    changeData: function(){
        var parent = Create_Topic.modal;

        this.onChangeData(parent.find('.name_topic'),'topic');
        this.onChangeData(parent.find('.name_post'),'post');
        this.onChangeData(parent.find('.message'),'message');
    },

    redirect: function(){
        if(Create_Topic.params.zip_code){
            window.location.href = baseUrl + "/netwrk/topic/topic-page?city="+Create_Topic.params.city+"&zipcode="+Create_Topic.params.zip_code+"&name="+Create_Topic.params.city_name+"&lat="+Create_Topic.params.lat+"&lng="+Create_Topic.params.lng;
        }else{
            window.location.href = baseUrl + "/netwrk/topic/topic-page?city="+Create_Topic.params.city;
        }
    },

    onChangeData: function(target,filter){
        target.unbind();
        target.on('keyup input',function(e){
            if($(e.currentTarget).val().length > 0){
                Create_Topic.params[filter] = $(e.currentTarget).val();
                Create_Topic.status_change[filter] = true;
            }else{
                Create_Topic.status_change[filter] = false;
            }
            Create_Topic.onCheckStatus();
        });
        // target.on('input',function(e){
        //     if($(e.currentTarget).val().length > 0){
        //         Create_Topic.params[filter] = $(e.currentTarget).val();
        //         Create_Topic.status_change[filter] = true;
        //     }else{
        //         Create_Topic.status_change[filter] = false;
        //     }
        //     Create_Topic.onCheckStatus();
        // });
    },

    onCheckStatus: function(){
        var status = Create_Topic.status_change;
        if(status.topic && status.post && status.message){
            status.total = true;
        }else{
            status.total = false;
        }
        Create_Topic.OnBtnTemplate();
    },

    OnBtnTemplate: function(){
        Create_Topic.OnshowReset();
        Create_Topic.OnshowSave();
    },

    OnshowReset: function(){
        var status = Create_Topic.status_change,
            parent = Create_Topic.modal,
            btn = parent.find('.cancel');
        if(status.topic || status.post || status.message){
            btn.removeClass('disable');
            Create_Topic.OnclickReset();
        }else if(!status.topic && !status.post && !status.message){
            btn.addClass('disable');
        }
    },

    OnclickReset: function(){
        var parent = Create_Topic.modal,
            btn = parent.find('.cancel');

        btn.unbind();
        btn.on('click',function(){
            if(!btn.hasClass('disable')){
                Create_Topic.reset_data();
                Create_Topic.setDefaultBtn();
            }
        });

    },

    reset_data: function(){
        var parent = Create_Topic.modal;

        Create_Topic.resetParams();
        parent.find('.name_topic').val('');
        parent.find('.name_post').val('');
        parent.find('.message').val('');
        parent.find('.group-category-content').html('');

        //reset the group category content params, so that params will not save to db
        //lat,lng only save when topic table when it creates from blue Dot on map.
        Create_Topic.params.lat = null;
        Create_Topic.params.lng = null;
        Create_Topic.params.isCreateFromBlueDot = false;


        Create_Topic.status_change.topic = false;
        Create_Topic.status_change.post = false;
        Create_Topic.status_change.message = false;
        Create_Topic.status_change.total = false;
    },

    setDefaultBtn: function(){
        var parent = Create_Topic.modal,
            btn_save = parent.find('.save'),
            btn_cancel = parent.find('.cancel');

            btn_save.addClass('disable');
            btn_cancel.addClass('disable');
    },

    OnshowSave: function(){
        var status = Create_Topic.status_change,
            parent = Create_Topic.modal,
            btn = parent.find('.save');
        if(status.topic && status.post && status.message){
            btn.removeClass('disable');
            Create_Topic.OnclickSave();
        }else if(!status.topic || !status.post || !status.message){
            btn.addClass('disable');
        }
    },

    OnclickSave: function(){
        var parent = Create_Topic.modal,
            btn = parent.find('.save'),
            city = Create_Topic.params.city;

        btn.unbind();
        btn.on('click',function(){

            if(!btn.hasClass('disable')){
                Ajax.new_topic(Create_Topic.params).then(function(data){
                    Create_Topic.params.city = data;
                    Create_Topic.reset_data();
                    Create_Topic.setDefaultBtn();
                    setTimeout(function(){
                        if(isMobile){
                            Create_Topic.redirect(Create_Topic.params.city);
                        }else{
                            Create_Topic.hideModalCreateTopic();
                            Topic.initialize(Create_Topic.params.city);
                            ChatInbox.GetDataListChatPost();
                            Map.update_marker(Create_Topic.params.city);
                        }
                    },700);
                });
            }
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
    },
    resetParams: function() {
        //reset create topic form params so when new form open then input box will be blank. Erase old set value for these params.
        Create_Topic.params.topic_id = '';
        Create_Topic.params.topic_title = '';
        Create_Topic.params.topic_name = '';
        Create_Topic.params.post_id = '';
        Create_Topic.params.post_title = '';
        Create_Topic.params.post_content = '';
    }
};
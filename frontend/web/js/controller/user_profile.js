var User_Profile = {
    data:{},
    contexts: {
        modalProfile: '.modal-profile'
    },
    templateData:{
        groups:{},
        topics:{},
        posts:{},
        items:{},
        favoriteCommunities: {},
        recentCommunities: {}
    },
    params:{
        age: 0,
        work: '',
        about: '',
        zipcode:0,
        lat:'',
        lng:'',
        isOpenProfileSlider:false
    },
    list:{
        group:{
            paging:1,
            status_paging: 1,
            loaded: 0,
            size: 20
        },
        topic:{
            paging:1,
            status_paging: 1,
            loaded: 0,
            size: 20
        },
        post:{
            paging:1,
            status_paging: 1,
            loaded: 0,
            size: 20
        }
    },
    tab_current: 'post',
    img:{
        image:''
    },
    num_len:true,
    zipcode: true,
    status_change:{
        age:true,
        zipcode: true,
        work: false,
        about:false,
        total:false
    },
    state: 'Indiana',
    profileContainer: $('.profile-container'),
    profileInfo: $('.profile-info'),
    editProfileModal: $('#modal_change_profile_picture'),
    slider: '#profile-slider',
    slider_hidden: "-400px",
    initialize: function(){
        Common.initTextLoader();
        if(isMobile){
            Default.SetAvatarUserDropdown();
            User_Profile.OnClickBack();
            User_Profile.onClickLoadMore();
        } else {
            User_Profile.ShowModalProfile();
        }

        User_Profile.resetProfile();
        User_Profile.getProfileInfo();

        //Show favorite communities of currentUser on profile modal
        User_Profile.ShowFavoriteCommunities();

        //Show Recent communities of currentUser on profile modal
        User_Profile.ShowRecentCommunities();

        User_Profile.OnClickTabBtn();

        //Init the recent activities button group and get data according to tab.
        User_Profile.getDataOnTab();

        //events
        User_Profile._eventClickPasswordSetting();
        User_Profile._eventClickSearchSetting();
        User_Profile._eventClickProfileInfo();
        Common.hideTextLoader();
    },
    initializeSlider: function() {
        User_Profile.onShowProfileSlider();
    },
    resetProfile: function(){
        User_Profile.profileInfo.html('');
    },

    getProfileInfo: function(){
        var self = this,
            profile_data = $('#profile_info');

        Ajax.getUserProfile().then(function(data){
            var json = $.parseJSON(data);
            User_Profile.data = json;

            User_Profile.params.age = json.age;
            User_Profile.params.work = json.work;
            User_Profile.params.about = json.about;
            User_Profile.params.zipcode = json.zip;

            if(User_Profile.data.status == 1){
                User_Profile.getTemplateProfileInfo(User_Profile.profileInfo,profile_data);
                User_Profile.editProfilePicture();

                User_Profile._eventClickPasswordSetting();
                User_Profile.editMeetInfo();
            }
        });
    },

    getTemplateProfileInfo: function(parent,target,callback){
        var template = _.template(target.html());
        var append_html = template({data: User_Profile.data});
        parent.append(append_html);

        if(_.isFunction(callback)){
            callback();
        }
    },

    editProfilePicture: function(){
        var btn = $('.change-profile');
        btn.on('click',function(){
            User_Profile.editProfileModal.modal({
                backdrop: true,
                keyboard: false
            });
            User_Profile.onchangeModalUpload();
        });
    },
    editMeetInfo: function(){
        var btn = $('.save', '.profile-info');
        btn.unbind();
        btn.on('click',function(){
            console.log('save clicked');
            var meet_info = $('#meet-info-textarea', '.profile-info').val();
            console.log(meet_info);
            var params = {'meet_info': meet_info};

            Ajax.updateProfileMeetInfo(params).then(function(data){
                var json = $.parseJSON(data);
                console.log(json);
                //todo: enable disable the button
                $('.meet-message').removeClass('hide');
                setTimeout(function() {
                    $('.meet-message').addClass('hide');
                }, 2000);
            });
        });
    },

    onchangeModalUpload: function(){
        $('.modal-backdrop.in').last().addClass('active');
        User_Profile.onBrowse();
        User_Profile.onCancel();
        User_Profile.onBackdrop();
    },

    onBrowse: function(){
        var btn = User_Profile.editProfileModal.find('.browse');
        btn.unbind();
        btn.on('click',function(e){
            $('.preview_img').find('img').remove();
            $('.preview_img_ie').find('img').remove();
            $('.image-preview').find('p').show();
            $('#input_image')[0].click();

            $('#input_image').unbind();
            $('#input_image').change(function(e) {
                User_Profile.handleFiles(this.files);
            });

        });
    },

    handleFiles: function(files){
        // var target = $('img.preview_image');
        var img = new Image(),
            parent_text = $('.image-preview').find('p'),
            btn_control_save = $('.btn-control-modal').find('.save');

        if(files.length > 0){
            img.src = window.URL.createObjectURL(files[0]);

            img.onload = function() {
                window.URL.revokeObjectURL(this.src);
                User_Profile.onEventSaveImage();
            };

            btn_control_save.removeClass('disable');
            parent_text.hide();

            if (isonIE()){
                $('.preview_img_ie').append(img);

            }else{
                $('.preview_img').addClass('active');
                $('.preview_img').append(img);
            }
            User_Profile.showImageOnIE();
        }
    },

    onEventSaveImage:function(){
        var btn_save = $('.btn-control-modal').find('.save');

        if (!btn_save.hasClass('disable')) {
            btn_save.on('click',function(){
                $('#upload_image').unbind();
                $('#upload_image').on('submit',function( event ) {
                    event.preventDefault();
                    var formData = new FormData(this);

                    Ajax.uploadProfileImage(formData).then(function(data){
                        var json = $.parseJSON(data);
                        User_Profile.img.images = json.data_image;
                        User_Profile.reloadProfilePicture();
                        $('.preview_img').find('img').remove();
                    });

                });
                $('#upload_image').submit();
            });
        };
    },

    reloadProfilePicture: function(){
        User_Profile.editProfileModal.modal('hide');
        $('.img-user').find('img').attr('src',User_Profile.img.images);
    },

    showImageOnIE: function(img){
        var target = $('.preview_img_ie').find('img'),
            w = $('.preview_img_ie').find('img').attr('width'),
            h = $('.preview_img_ie').find('img').attr('height');
    },

    onCancel: function(){
        var btn = $('.btn-control-modal').find('.cancel');
        btn.on('click',function(){
            User_Profile.editProfileModal.modal('hide');
            // $('img.preview_image').attr('src','');
            // $('img.preview_image').hide();
            $('.preview_img').find('img').remove();
            $('.image-preview').find('p').show();
            $('.btn-control-modal').find('.save').addClass('disable');
            $('.preview_img').removeClass('active');
        });
    },

    onBackdrop: function(){
        User_Profile.editProfileModal.on('hidden.bs.modal',function() {
            $('img.preview_image').attr('src','');
            $('img.preview_image').hide();
            $('.image-preview').find('p').show();
            $('.btn-control-modal').find('.save').addClass('disable');
            $('.preview_img').removeClass('active');
        });
    },
    onClickLoadMore: function() {
        var parent = $(".Profile-view").find('.load-more');
        parent.unbind();
        parent.on('click', function(){
            if (User_Profile.list[User_Profile.tab_current].status_paging == 1 && User_Profile.tab_current == "topic"){
                User_Profile.loadMoreTopic();
            } else if(User_Profile.list[User_Profile.tab_current].status_paging == 1 && User_Profile.tab_current == "group") {
                User_Profile.loadMoreGroup();
            } else if(User_Profile.list[User_Profile.tab_current].status_paging == 1 && User_Profile.tab_current == "post") {
                User_Profile.loadMorePost();
            }
        });
    },
    CustomScrollBar: function(){
        var parent = $("#modal_profile").find('.modal-body');

        parent.mCustomScrollbar({
            theme:"dark",
            callbacks:{
                onTotalScroll: function(){
                    if (User_Profile.list[User_Profile.tab_current].status_paging == 1 && User_Profile.tab_current == "topic"){
                        User_Profile.loadMoreTopic();
                    } else if(User_Profile.list[User_Profile.tab_current].status_paging == 1 && User_Profile.tab_current == "group") {
                        User_Profile.loadMoreGroup();
                    } else if(User_Profile.list[User_Profile.tab_current].status_paging == 1 && User_Profile.tab_current == "post") {
                        User_Profile.loadMorePost();
                    } else {

                    }
                }
            }
        });
    },
    loadMoreTopic: function(){
        var template = $('#recent_activity_container');
        var templateData = $('#profile_topic_info');
        var self = this;
        self.list[User_Profile.tab_current].paging ++ ;

        var params = {'filter': null, 'size': self.list[User_Profile.tab_current].size, 'page':self.list[User_Profile.tab_current].paging};

        Ajax.show_user_topics(params).then(function(data){
            var json = $.parseJSON(data);
            var jsonLength = _.size(json.data);
            console.log('loadMoreTopic data length '+ jsonLength);

            if(jsonLength > 0) {
                //assign ajax data to template data
                User_Profile.templateData.topics = json.data;

                //set my topics count on recent activity section
                if (json.total_count) {
                    $('.recent_activities_wrapper', '.profile-activity-wrapper').find('.group-count').html('').html('My Channels: '+json.total_count);
                }

                template.scrollTop(0);
                //hide no data section
                template.find('.no-data').hide();
                User_Profile.getTemplateTopicInfo(template, templateData);

                // Initialize click on topic name
                Topic.OnClickTopicFeed();

                self.list[User_Profile.tab_current].loaded = self.list[User_Profile.tab_current].paging;
            } else {
                User_Profile.setPaginationStatus(json.data);
            }

        });
    },
    loadMoreGroup: function(){
        var template = $('#recent_activity_container');
        var templateData = $('#profile_group_info');
        var self = this;
        self.list[User_Profile.tab_current].paging ++ ;

        var params = {'filter': null, 'user_id': UserLogin, 'size': self.list[User_Profile.tab_current].size, 'page':self.list[User_Profile.tab_current].paging};

        //set tab current as group
        User_Profile.tab_current = 'group';
        User_Profile.setTabActive();

        Ajax.show_user_groups(params).then(function(data) {
            var json = $.parseJSON(data);
            var jsonLength = _.size(json.data);
            console.log('loadMoreGroup data length '+ jsonLength);

            if(jsonLength > 0) {
                //assign ajax data to template data
                User_Profile.templateData.groups = json.data;

                //set my topics count on recent activity section
                if (json.total_count) {
                    $('.recent_activities_wrapper', '.profile-activity-wrapper').find('.group-count').html('').html('My Groups: ' + json.total_count);
                }

                template.scrollTop(0);
                //hide no data section
                template.find('.no-data').hide();
                User_Profile.getTemplateGroupInfo(template, templateData);
            } else {
                User_Profile.setPaginationStatus(json.data);
            }
        });
    },
    loadMorePost: function(){
        if (isMobile) {
            var template = $('#recent_activity_container', '.Profile-view');
        } else {
            var template = $('#recent_activity_container', User_Profile.contexts.modalProfile);
        }

        var templateData = $('#profile_post_info');
        var self = this;
        self.list[User_Profile.tab_current].paging ++ ;

        var params = {'filter': null, 'size': self.list[User_Profile.tab_current].size, 'page':self.list[User_Profile.tab_current].paging};

        //set tab current as group
        User_Profile.tab_current = 'post';
        User_Profile.setTabActive();

        Ajax.show_user_posts(params).then(function(data){
            var json = $.parseJSON(data);
            var jsonLength = _.size(json.data);
            console.log('loadMorePost data length '+ jsonLength);
            if(jsonLength > 0) {
                //assign ajax data to template data
                User_Profile.templateData.posts = json.data;

                //set my lines count on recent activity section
                if (json.total_count) {
                    $('.recent_activities_wrapper', '.profile-activity-wrapper').find('.group-count').html('').html('My Lines: '+json.total_count);
                }

                template.scrollTop(0);
                //hide no data section
                template.find('.no-data').hide();
                User_Profile.getTemplatePostInfo(template, templateData);

                // Initialize click on post name
                Topic.OnClickPostFeed();
            } else {
                User_Profile.setPaginationStatus(json.data);
            }

        });
    },
    setPaginationStatus: function(json){
        var self = this;
        var jsonLength = _.size(json);
        console.log('jsonLength '+ jsonLength);

        if(jsonLength > 0){
            self.list[User_Profile.tab_current].status_paging = 1;
        } else{
            self.list[User_Profile.tab_current].status_paging = 0;
        }
        console.log('self.list['+User_Profile.tab_current+'].status_paging '+self.list[User_Profile.tab_current].status_paging);
        if(isMobile) {
            var parent = $(".Profile-view").find('.load-more');
            if(self.list[User_Profile.tab_current].status_paging == 0) {
                parent.removeClass('hidden').addClass('hidden');
            } else {
                parent.removeClass('hidden');
            }
        }
    },
    ShowModalProfile: function(){
        var profileModal = $('#modal_profile'),
            self = this;

        profileModal.modal({
            backdrop: true,
            keyboard: false
        });

        User_Profile.CustomScrollBar();

        profileModal.on('hidden.bs.modal',function() {
            profileModal.modal('hide');
        });
        $('.modal-backdrop.in').click(function(e) {
            profileModal.modal('hide');
        });
    },

    _eventClickPasswordSetting: function() {
        var target = $('#password_setting','.user-details-wrapper');
            self = this;

        target.unbind();
        target.click(function(){
            if(isMobile){
                window.location.href = baseUrl+ "/netwrk/password-setting";
            } else {
                $('.modal').modal('hide');
                Password_Setting.initializeSlider();
                //Password_Setting.initialize();
            }
        });
    },

    _eventClickSearchSetting: function() {
        var target = $('#search_setting','.user-details-wrapper'),
            self = this;

        target.unbind();
        target.click(function(){
            if(isMobile){
                window.location.href = baseUrl+ "/netwrk/search-setting";
            } else {
                $('.modal').modal('hide');
                //Search_Setting.initialize();
                Search_Setting.initializeSlider();
            }
        });
    },

    _eventClickProfileInfo: function() {
        var target = $('#my_profile_info','.user-details-wrapper'),
            self = this;

        target.unbind();
        target.click(function(){
            if(isMobile){
                window.location.href = baseUrl+ "/netwrk/profile-info";
            } else {
                $('.modal').modal('hide');
                //ProfileInfo.initialize();
                ProfileInfo.initializeSlider();
            }
        });
    },
    _eventClickProfileEdit: function() {
        var target = $('#my_profile_edit','.user-details-wrapper'),
            self = this;

        target.unbind();
        target.click(function(){
            if(isMobile){
                window.location.href = baseUrl+ "/netwrk/profile-edit";
            } else {
                $('.modal').modal('hide');
                //ProfileEdit.initialize();
                ProfileEdit.initializeSlider();
            }
        });
    },

    _eventClickCommunityTrigger: function(){
        return;
        var target = $('.community-modal-trigger','#favoriteCommunities').add('.community-modal-trigger','#recentCommunities');

        target.unbind();
        target.click(function(e){
            var city_id = $(e.currentTarget).attr('data-city-id');
            var lat = $(e.currentTarget).attr('data-lat');
            var lng = $(e.currentTarget).attr('data-lng');

            if(isMobile){
                var url = baseUrl + "/netwrk/topic/topic-page?city="+city_id;
                window.location.href= url;
            } else {
                $('.modal').modal('hide');
                Topic.initialize(city_id);
                //set center the map using city lat and lng
                //Map.SetMapCenter(lat,lng);
            }
        });
    },

    getTemplateGroupInfo: function(parent,target,callback){
        var template = _.template(target.html());
        var json = User_Profile.templateData.groups;
        var append_html = template({groups: json});
        parent.append(append_html);

        if(_.isFunction(callback)){
            callback();
        }
        User_Profile.setPaginationStatus(json);
        User_Profile.onTemplate();
    },
    onTemplate: function() {
        if(User_Profile.tab_current == 'group') {
            User_Profile.onClickEditGroup();
            User_Profile.onClickDeleteGroup();
        } else if(User_Profile.tab_current == 'post') {
            User_Profile.onClickEditPost();
        } else if(User_Profile.tab_current == 'topic') {
            console.log('in tab_current');
            User_Profile.onClickEditTopic();
        } else {
            User_Profile.onClickEditGroup();
            User_Profile.onClickDeleteGroup();
        }

    },
    onClickEditGroup: function() {
        if(isMobile) {
            var target = $('.edit-group', '.Profile-view');
        } else {
            var target = $('.edit-group', User_Profile.contexts.modalProfile);
        }

        target.each(function() {
            $(this).unbind("click").click(function() {
                if(isMobile) {
                    window.location.href = baseUrl + "/netwrk/group/create-group?city="+ $(this).data("city_id") +"&group_id="+$(this).data("id")+"";
                } else {
                    $('#modal_profile').modal('hide');
                    Common.HideTooTip();
                    Create_Group.initialize($(this).data("city_id"),null,null,$(this).data("id"));
                }
            });
        });
    },
    onClickDeleteGroup: function() {
        var target = $('.delete-group', User_Profile.contexts.modalProfile);

        target.each(function() {
            $(this).unbind("click").click(function() {
                var row = $(this).parent().parent().parent().parent();
                var row = $(this).closest('.item');
                console.log(row.attr('class'));
                if (confirm("Are you sure you want to delete this group?")) {
                    Ajax.delete_group({
                        "id": $(this).data("id")
                    }).then(function(data) {
                        var json = $.parseJSON(data);
                        if (json.error) alert(json.error.message);
                        else row.remove();
                    });
                }
            });
        });
    },
    /* On click of edit button in post list then open post edit form */
    onClickEditPost: function() {
        if(isMobile){
            var btn = $('.post-edit', '.Profile-view');
            btn.each(function () {
                console.log('in btn click');
                $(this).unbind("click").click(function () {
                    var post_id = $(this).attr('data-id'),
                        topic_id = $(this).attr('data-topic_id'),
                        city_id = $(this).attr('data-city_id');
                    window.location.href = baseUrl + "/netwrk/post/create-post?city="+ city_id +"&topic="+topic_id+"&post_id="+post_id;
                });
            });
        }else {
            var btn = $('.post-edit', User_Profile.contexts.modalProfile);
            btn.each(function () {
                $(this).unbind("click").click(function () {
                    var post_id = $(this).attr('data-id');
                    $('#modal_profile').modal('hide');
                    Create_Post.initialize(null, null, null, null, post_id);
                });
            });
        }
    },
    onClickEditTopic: function() {
        if(isMobile){
            var target = $('.edit-topic', '.Profile-view');
            target.each(function () {
                $(this).unbind("click").click(function () {
                    var topic_id = $(this).attr('data-id'),
                        city_id = $(this).attr('data-city');
                    window.location.href = baseUrl + "/netwrk/topic/create-topic?city="+city_id+'&topic_id='+topic_id;
                });
            });
        }else {
            var target = $('.edit-topic', User_Profile.contexts.modalProfile);

            target.each(function () {
                $(this).unbind("click").click(function () {
                    $('#modal_profile').modal('hide');
                    Common.HideTooTip();
                    Create_Topic.initialize($(this).data("city_id"), $(this).data("city_name"), null, null, null, null, $(this).data("id"));
                });
            });
        }
    },
    getTemplateTopicInfo: function(parent,target,callback){
        var template = _.template(target.html());
        var json = User_Profile.templateData.topics;

        var append_html = template({topics: json });
        parent.append(append_html);

        if(_.isFunction(callback)){
            callback();
        }
        User_Profile.setPaginationStatus(json);
    },
    getTemplatePostInfo: function(parent,target,callback){
        var template = _.template(target.html());
        var json = User_Profile.templateData.posts;
        var append_html = template({posts: json});
        parent.append(append_html);

        if(_.isFunction(callback)){
            callback();
        }
        User_Profile.setPaginationStatus(json);
        User_Profile.onTemplate();
    },

    //set selected navigation like group, topic or post as active.
    setTabActive: function(){
        var target = $('.navigation-btn-group', '.profile-activity-wrapper');

        //Remove active class from button.
        target.find('.btn').each(function(){
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            }
        });

        //Check profiles current tab and set selected tab active.
        switch(User_Profile.tab_current) {
            case 'post':
                target.find('.post').addClass('active');
                break;
            case 'topic':
                target.find('.topic').addClass('active');
                break;
            case 'group':
                target.find('.group').addClass('active');
                break;
        }
    },

    groupTrigger: function(){
        var parent = $('#recent_activity_container').find('.group-item .group-trigger');

        parent.unbind();
        parent.on('click',function(){
            var city = $(this).attr('data-city-id'),
                cityZip = $(this).attr('data-city-zip'),
                cityName = $(this).attr('data-city-name'),
                group = $(this).attr('data-id'),
                groupName = $.trim($(this).text());

            if(isMobile){
                var params = {group: group, name: groupName, from: 'profile'};
                Topic.initialize(city,params);
            } else {
                var params = {zipcode: cityZip};
                $('#modal_profile').modal('hide');

                Topic.tab_current = 'groups';
                Topic.initialize(city,params);

                // Load group topics and display the same
                Group.data.filter = 'recent';
                var group = $(this).attr('data-id');
                var groupName = $(this).text();
                var parent = $('#item_topic_group_list_' + Group.data.filter);

                Group.ShowTopics(parent, group, groupName);

                $('#modal_topic').find(".dropdown").removeClass('visible');
                $('#modal_topic .sidebar').find('.dropdown').addClass('visible');

                //Hide the group tab header from topic modal.
                Topic.HideTabGroupHeader();
            }
        });
    },
    //Show group information of users
    ShowGroups: function(isSlider){
        if(isSlider == true) {
            var template = $('#recent_activity_container_groups');
        } else {
            var template = $('#recent_activity_container');
        }
        var templateData = $('#profile_group_info');

        var self = this;
        self.list[User_Profile.tab_current].paging = 1;
        var params = {'filter': 'recent', 'user_id': UserLogin, 'size': self.list[User_Profile.tab_current].size, 'page':self.list[User_Profile.tab_current].paging};

        //show tamplate
        template.removeClass('hidden');
        template.html('');

        //set tab current as group
        User_Profile.tab_current = 'group';
        User_Profile.setTabActive();

        Ajax.show_user_groups(params).then(function(data){
            var json = $.parseJSON(data);

            //assign ajax data to template data
            User_Profile.templateData.groups = json.data;

            //set my Groups count on recent activity section
            if (json.total_count) {
                if(isSlider == true) {
                    $('#recent-activities-groups').find('.group-count').html('').html('My Groups: ' + json.total_count);
                } else {
                    $('.recent_activities_wrapper', '.profile-activity-wrapper').find('.group-count').html('').html('My Groups: '+json.total_count);
                }
            }

            template.scrollTop(0);
            //hide no data section
            template.find('.no-data').hide();
            User_Profile.getTemplateGroupInfo(template, templateData);

            User_Profile.groupTrigger();
            Common.deleteTrigger();
        });
    },

    //Show Topics information of users
    ShowTopics: function(isSlider){
        if(isSlider == true) {
            var template = $('#recent_activity_container_topics');
        } else {
            var template = $('#recent_activity_container');
        }

        var templateData = $('#profile_topic_info');

        var self = this;
        self.list[User_Profile.tab_current].paging = 1;
        var params = {'filter': null, 'size': self.list[User_Profile.tab_current].size, 'page':self.list[User_Profile.tab_current].paging};

        //set tab current as group
        User_Profile.tab_current = 'topic';
        User_Profile.setTabActive();

        //show tamplate
        template.removeClass('hidden');
        template.html('');
        Ajax.show_user_topics(params).then(function(data){
            var json = $.parseJSON(data);

            //assign ajax data to template data
            User_Profile.templateData.topics = json.data;

            //set my Channels count on recent activity section

                if (json.total_count) {
                    if(isSlider == true) {
                        $('#recent-activities-channels').find('.group-count').html('').html('My Channels: ' + json.total_count);
                    } else {
                        $('.recent_activities_wrapper', '.profile-activity-wrapper').find('.group-count').html('').html('My Channels: ' + json.total_count);
                    }
                }

            template.scrollTop(0);
            //hide no data section
            template.find('.no-data').hide();
            User_Profile.getTemplateTopicInfo(template, templateData);

            User_Profile.onTemplate();
            // Initialize click on topic name
            Topic.OnClickTopicFeed();
            Common.deleteTrigger();
        });
    },
    //Show Topics information of users
    ShowPosts: function(isSlider){
        if(isSlider == true) {
            var template = $('#recent_activity_container_posts');
        } else {
            var template = $('#recent_activity_container');
        }

        var templateData = $('#profile_post_info');
        var self = this;
        self.list[User_Profile.tab_current].paging = 1;
        var params = {'filter': null, 'size': self.list[User_Profile.tab_current].size, 'page':self.list[User_Profile.tab_current].paging};

        //show tamplate
        template.removeClass('hidden');
        template.html('');

        //set tab current as group
        User_Profile.tab_current = 'post';
        User_Profile.setTabActive();

        Ajax.show_user_posts(params).then(function(data){
            var json = $.parseJSON(data);

            //assign ajax data to template data
            User_Profile.templateData.posts = json.data;

            //set my topics count on recent activity section
            if (json.total_count) {
                if(isSlider == true) {
                    $('#recent-activities-lines').find('.group-count').html('').html('My Lines: ' + json.total_count);
                } else {
                    $('.recent_activities_wrapper', '.profile-activity-wrapper').find('.group-count').html('').html('My Lines: '+json.total_count);
                }
            }

            template.scrollTop(0);
            //hide no data section
            template.find('.no-data').hide();
            User_Profile.getTemplatePostInfo(template, templateData);

            // Initialize click on post name
            Topic.OnClickPostFeed();
            Common.deleteTrigger();
        });
    },

    OnClickTabBtn: function () {
        var Context = '.recent_activities_wrapper',
            Topic = '.topic',
            Group = '.group',
            Post  = '.post';

        $(Topic, Context).unbind();
        $(Topic, Context).on('click', function(){
            User_Profile.tab_current = 'topic';
            User_Profile.getDataOnTab();
        });

        $(Group, Context).unbind();
        $(Group, Context).on('click', function(){
            User_Profile.tab_current = 'group';
            User_Profile.getDataOnTab();
        });

        $(Post, Context).unbind();
        $(Post, Context).on('click', function(){
            User_Profile.tab_current = 'post';
            User_Profile.getDataOnTab();
        });

    },
    getDataOnTab: function() {
        switch(User_Profile.tab_current) {
            case 'post':
                User_Profile.ShowPosts();
                break;
            case 'topic':
                User_Profile.ShowTopics();
                break;
            case 'group':
                User_Profile.ShowGroups();
                break;
        }
    },
    getTemplateFavoriteInfo: function(parent,target,callback){
        var template = _.template(target.html());

        var append_html = template({items: User_Profile.templateData.favoriteCommunities});
        parent.append(append_html);

        if(_.isFunction(callback)){
            callback();
        }
    },
    getTemplateRecentInfo: function(parent,target,callback){
        var template = _.template(target.html());

        var append_html = template({items: User_Profile.templateData.recentCommunities});
        parent.append(append_html);

        if(_.isFunction(callback)){
            callback();
        }
    },
    ShowFavoriteCommunities: function(){
        if (isMobile) {
            var parent = $('.fav-communities_content-wrapper', '.Profile-view');
        } else {
            var parent = $('.fav-communities_content-wrapper', User_Profile.contexts.modalProfile);
        }

        var content = $('#profile_fav-communities_template');
        var params = {'filter': 'recent'};

        parent.html('');

        Ajax.show_user_favorite_communities(params).then(function(data){
            var json = $.parseJSON(data);

            //Assign ajax data to template data
            User_Profile.templateData.favoriteCommunities = json.data;

            //Set the template data
            User_Profile.getTemplateFavoriteInfo(parent, content);

            // Initialize the click on community name and delete icon
            User_Profile._eventClickCommunityTrigger();
            Topic.OnClickFavorite();
        });
    },
    ShowRecentCommunities: function(){
        if (isMobile) {
            var parent = $('.recent-communities_content-wrapper', '.Profile-view');
        } else {
            var parent = $('.recent-communities_content-wrapper', User_Profile.contexts.modalProfile);
        }

        var content = $('#profile_recent-communities_template');
        var params = {'filter': 'recent'};

        parent.html('');

        Ajax.show_user_recent_communities(params).then(function(data){
            var json = $.parseJSON(data);

            //Assign ajax data to template data
            User_Profile.templateData.recentCommunities = json.data;

            //Set the template data
            User_Profile.getTemplateRecentInfo(parent, content);

            // Initialize the click on community name and delete icon
            User_Profile._eventClickCommunityTrigger();
            Log.OnClickDelete();
        });
    },
    OnClickBack: function(){
        if(isMobile){
            $('.Profile-view .back-page').off('click').on('click', function(){
                sessionStorage.show_landing = 1;
                window.location.href = baseUrl + "/netwrk/default/home";
            })
        }
    },
    getProfileData: function() {
        //todo: if chatInbox open then close it.
        User_Profile.resetProfile();
        User_Profile.getProfileInfo();

        //Show favorite communities of currentUser on profile modal
        User_Profile.ShowFavoriteCommunities();

        //Show Recent communities of currentUser on profile modal
        User_Profile.ShowRecentCommunities();

        User_Profile.OnClickTabBtn();

        User_Profile.ShowPosts(true);

        //User_Profile.ShowTopics(true);

        //User_Profile.ShowGroups(true);

        //events

        User_Profile._eventClickProfileInfo();
        User_Profile._eventClickProfileEdit();
        User_Profile._eventClickPasswordSetting();
        User_Profile._eventClickSearchSetting();
    },

    onShowProfileSlider: function(){
        User_Profile.closeOtherSlider();
        if ($(User_Profile.slider).css('right') == User_Profile.slider_hidden) {
            $(User_Profile.slider).animate({
                "right": "0"
            }, 500);

            var parent = $(User_Profile.slider);
            parent.mCustomScrollbar({
                theme:"dark",
                callbacks:{
                }
            });

            User_Profile.getProfileData();
            User_Profile.activeResponsiveProfileSlider();
        } else {
            $(User_Profile.slider).animate({
                "right": User_Profile.slider_hidden
            }, 500);

            User_Profile.deactiveResponsiveProfileSlider();
        }
    },
    activeResponsiveProfileSlider: function() {
        var width = $( window ).width();
        $(".modal").addClass("responsive-profile-slider");
        if (width <= 1250) {
            $('#btn_meet').css('z-index', '1050');
        }

        User_Profile.params.isOpenProfileSlider = true;
        $('.box-navigation').css({'left': '', 'right' : '395px'});
        $('#btn_my_location_old').css({'left': '', 'right' : '335px'});
        $('#btn_meet').css({'left': '', 'right' : '335px'});
    },
    deactiveResponsiveProfileSlider: function() {
        var width = $( window ).width();
        $(".modal").removeClass("responsive-profile-slider");

        if (width <= 1250) {
            $('#btn_meet').css('z-index', '10000');
        }

        User_Profile.params.isOpenProfileSlider = false;
        $('.box-navigation').css({'left': '', 'right' : '75px'});
        $('#btn_my_location_old').css({'left': '', 'right' : '15px'});
        $('#btn_meet').css({'left': '', 'right' : '15px'});
    },
    closeOtherSlider: function() {
        //close profile slider if it is already open
        if(Password_Setting.isOpenPasswordSettingSlider) {
            Password_Setting.showPasswordSettingSlider();
        }
        if(Search_Setting.isOpenSearchSettingSlider) {
            Search_Setting.showSearchSettingSlider();
        }
        if(ProfileInfo.isOpenProfileInfoSlider) {
            ProfileInfo.showProfileInfoSlider();
        }
        if(ProfileEdit.isOpenProfileEditSlider) {
            ProfileEdit.showProfileEditSlider();
        }
    }
};
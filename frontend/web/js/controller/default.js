var Default ={
    initialize: function() {
        var self = this,
            hash = location.hash.substr(1);

        if(hash == 'email_required') {
            // Display facebook share email settings modal
            Default.displayFacebookShareSettingModal();
        }

        if(isMobile){
            self._eventClickMeetBtnMobile();
            self._eventClickChatInboxBtnMobile();
            //Default.show_blue_dot();

            if (sessionStorage.is_topic_marker_in_map_center == 1) {
                Map.showTopicMarker(sessionStorage.topic_lat, sessionStorage.topic_lng, sessionStorage.topic_city_id);
            }
            set_size_search();
        }else{
            $('#btn_meet').show();
            self._eventClickMeetBtn();
            ChatInbox.OnClickChatInbox();
            ResetPass.CheckSessionResetPassword();
            Default.onCLickModal();
            if(typeof isCoverPageVisited !== 'undefined' && isAccepted) {
                //LandingPage.GetDataTopLanding();
                Default.getFeeds();
            }
        }
        // Default.ShowLandingPage();

        if(typeof isCoverPageVisited !== 'undefined'){
            if (isAccepted) {
                $("body").css('background', 'f2f2f2');
                if (isMobile) {
                    Default.ShowLandingPage();
                } else {
                    if(isResetPassword){
                        ResetPass.initialize();
                    }else{
                        Default.ShowLandingPage();
                    }
                }
            } else {
                CoverPage.initialize();
            }
        } else {
            if(typeof isAccepted === 'undefined'){
                CoverPage.initialize();
            } else {
                if (isMobile) {
                    Default.ShowLandingPage();
                } else {
                    LandingPage.initialize();
                }
            }
        }
        if(!isGuest){
            Default.ShowNotificationOnChat();
        } else {
            Default.HideNotificationOnChat();
            Default.ShowDefaultNotificationOnChat();
        }

        if(typeof isCoverPageVisited !== 'undefined' && isAccepted) {
            Default.SetAvatarUserDropdown();
            if(!isMobile){
                Default.displayNetwrkIconUi();
            }
        }
    },

    UnsetLanding: function(){
        sessionStorage.show_landing = 0;
    },

    ShowLandingPage: function(){
        if(isMobile){
            if(welcomePage == 'true') {
                LandingPage.OnHideModalWelcome();
                LandingPage.OnClickBackdropWelcome();
                //LandingPage.showLandingWelcome();
            } else {
                sessionStorage.map_zoom = 18;
                //$('.landing-trigger', '.logo-active').trigger('click');
            }

            if(!sessionStorage.show_landing || sessionStorage.show_landing == 0){
                sessionStorage.map_zoom = 18;
                if(welcomePage == 'true') {
                    LandingPage.OnHideModalWelcome();
                    LandingPage.OnClickBackdropWelcome();
                    //LandingPage.showLandingWelcome();
                }/* else {
                    $('.landing-trigger', '.logo-active').trigger('click');
                }*/
            } else if(sessionStorage.show_landing == 2 && location.href == baseUrl + "/netwrk/default/landing-page"){
                LandingPage.initialize();
                Default.UnsetLanding();
            } else {
                sessionStorage.map_zoom = 18;
                //$('.landing-trigger', '.logo-active').trigger('click');
            }
            /*if(!sessionStorage.show_landing || sessionStorage.show_landing == 0){
                alert('in ShowLandingPage function .LandingPage.redirect() ='+sessionStorage.show_landing);
                LandingPage.redirect();
            }else if(sessionStorage.show_landing == 1){
                Default.UnsetLanding();
            }
            else if(sessionStorage.show_landing == 2 && location.href == baseUrl + "/netwrk/default/landing-page"){
                alert('in ShowLandingPage before LandingPage.initialize()');
                LandingPage.initialize();
            }else if(sessionStorage.show_landing == 2){
                alert('in ShowLandingPage == 2 only &&  before LandingPage.redirect()');
                LandingPage.redirect();
            }*/
        }else{
            if (isCoverPageVisited) {
                if(isResetPassword){
                    ResetPass.initialize();
                }else if(isUserInvitation){
                    Signup.initialize('join');
                }else{
                    LandingPage.initialize();
                }
                //Comment page reload twice code
                /*sessionStorage.redirected = true;
                if (sessionStorage.redirected) {
                    sessionStorage.removeItem('redirected');
                    if(isResetPassword){
                        ResetPass.initialize();
                    }else{
                        LandingPage.initialize();
                    }
                } else {
                    sessionStorage.redirected = true;
                    window.location.href = baseUrl;// + "/netwrk/default/home";
                }*/
            }
        }
    },

    getMarkerDefault: function(){
        var parent = $('.indiana_marker');
        // Ajax.get_marker_default().then(function(data){
        //     Default.getTemplate(parent,data);
        // });
    },

    getMarkerZoom: function(){
        var parent = $('.indiana_marker');
        // Ajax.get_marker_zoom().then(function(data){
        //     Default.getTemplate(parent,data);
        // });

    },

    _eventClickMeetBtn: function() {
        var target = $('#btn_meet, #btn_nav_meet').add('#btn_meet-trigger'),
            self = this;

        target.on('click',function(){
            $('.modal').modal('hide');
            Meet.initialize();

        });
    },

    _eventClickMeetBtnMobile: function(){
        var target = $('#btn_meet_mobile, #btn_nav_meet_mobile');

        target.on('click',function(){
            $.when(Common.mobileNavUnSelect()).done(function(){
                Meet.showUserMeetMobile();
            });
        });
    },

    _eventClickChatInboxBtnMobile: function() {
        var target = $('#chat_inbox_btn_mobile, #chat_inbox_nav_btn_mobile');
        target.unbind();
        target.on('click',function(){
            $.when(Common.mobileNavUnSelect()).done(function(){
                sessionStorage.url = window.location.href;
                ChatInbox.OnClickChatInboxMobile();
            });
            // Ajax.set_previous_page(window.location.href).then(function(data){
            // });
        });
    },

    getTemplate: function(parent,data){
        var self = this;
        var json = $.parseJSON(data);
        var list_template = _.template($("#netwrk_place").html());
        var append_html = list_template({cities: json});

        parent.append(append_html);
    },
    hideHeaderFooter: function(){
        $('.navbar-fixed-top').hide();
        $('.navbar-fixed-bottom').hide();
    },

    ShowNotificationOnChat: function(){
        if(!isGuest){
            Ajax.count_unread_message().then(function(data){
                var json = $.parseJSON(data), notify;
                if(isMobile) {
                    notify = $("#chat_inbox_btn_mobile, #chat_inbox_nav_btn_mobile").find('.notify');
                } else {
                    notify = $("#chat_inbox_btn").find('.notify');
                }
                if (json > 0){
                    notify.html(json);
                    notify.removeClass('disable');
                } else {
                    notify.html(0);
                    notify.addClass('disable');
                }
            });
        } else {
            Default.HideNotificationOnChat();
            Default.ShowDefaultNotificationOnChat();
        }
    },
    HideNotificationOnChat: function() {
        var notify = '';
        if(isMobile) {
            notify = $("#chat_inbox_btn_mobile, #chat_inbox_nav_btn_mobile").find('.notify');
        } else {
            notify = $("#chat_inbox_btn").find('.notify');
        }
        notify.html(0);
        notify.addClass('disable');
    },
    /* When Guest user comes site, then display default notification on chat button in navigation */
    ShowDefaultNotificationOnChat: function() {
        var notify = '',
            json = 1;
        if(isMobile) {
            notify = $("#chat_inbox_btn_mobile, #chat_inbox_nav_btn_mobile").find('.notify');
        } else {
            notify = $("#chat_inbox_btn").find('.notify');
        }
        notify.html(json);
        notify.removeClass('disable');
    },
    onCLickModal: function(){
        var modal = $('.modal');
        modal.on('click', function(e) {
            $('.popup_chat_modal .popup-box').css('z-index', '1050');
        });
    },

    displayPopupOnTop: function(){
        var modal = $('.in');
        if(modal.length > 0){
            $("#popup-chat-" + PopupChat.params.post).css('z-index', '10500');
        }
    },

    SetAvatarUserDropdown: function() {
        /*if(typeof isCoverPageVisited !== 'undefined' && isAccepted) {
            LandingPage.GetDataTopLanding();
        }*/
        if(isMobile){
            var height = $(window).height();
            var width = $(window).width();
            var wrapperHeight = height - 85;
            var chatTabHeight = Math.ceil((height/100)*80);
            var chatWidth = width - 100;

            var chatTab = $('#chat_inbox').find('#lines_tab');
            var newsTab = $('#chat_inbox').find('#area_news_tab');
            var netwrkNewsTab = $('#netwrkNews').find('.tab-content');
            chatTab.css('max-height', chatTabHeight);
            newsTab.css('max-height', wrapperHeight - 37);
            netwrkNewsTab.css('max-height', wrapperHeight);
            $('#netwrkNavigation').css('height', height);
            $('#chat_inbox').css('height', wrapperHeight);
            $('#netwrkNews').css('width', width).css('height', wrapperHeight);
        }

        if(isGuest){
            $('.btn-netwrk-news', '#netwrkNavigation').addClass('disabled');
        } else {
            Default.getUserFavorites();
            Default.onClickNetwrkNews();
        }
        Default.onClickNavigationIcon();
        if (UserLogin && typeof isCoverPageVisited !== 'undefined') {
            Ajax.get_user_profile().then(function(data){
                sessionStorage.UserInfo = data;
                data = $.parseJSON(data);

                if(isMobile){
                    var list_template = _.template($("#account_button" ).html());
                    var append_html = list_template({user_info: data});
                    $('#nav_wrapper #buttonProfileWrapper').remove();
                    $('#nav_wrapper').append(append_html);
                } else {
                    var list_template = _.template($("#account_nav_dropdown" ).html());
                    var append_html = list_template({user_info: data});

                    $('.nav-buttion-section').find('.profile-button-wrap').find('.btn-profile').remove();
                    $('.nav-buttion-section').find('.profile-button-wrap').append(append_html);
                    //$('#netwrkNavigation #navProfileWrapper').remove();
                    //$('#netwrkNavigation').append(append_html);
                }
                /*if(isMobile){
                    $('#nav_wrapper #btn_nav_meet_mobile').before(append_html);
                } else {
                    $('#netwrkNavigation').append(append_html);
                }
                //$('.corner-login-wrapper #btn_my_location_old').remove();
                }*/
                /*$('#nav_wrapper #navProfileWrapper').remove();
                if(isMobile){
                    $('#nav_wrapper #btn_nav_meet_mobile').before(append_html);
                } else {
                    $('#nav_wrapper #btn_nav_meet').before(append_html);
                }*/
                //$("#nav_wrapper .btn").eq(1).after(append_html);
                //$('#nav_wrapper').find('#navProfileWrapper').html(append_html);
                Common._eventClickProfileNavMenu();
            });
            //Hide the sign in button from nav
            $(Common.contexts.loginTrigger, Common.contexts.boxNavigation).remove();
        }
    },

    OnHoverAvatarDropdown: function() {
        var btn = $('#account_nav_profile');
        btn.hover(
            function(){
                $(ChatInbox.modal).css('z-index','999');
            }
            , function(){
                $(ChatInbox.modal).css('z-index','9999');
            });
    },

    displayNetwrkIconUi : function(){
        ChatInbox.initialize();
    },

    onClickNavigationIcon: function () {
        var target = $('.landing-trigger');

        target.unbind();
        target.on('click',function(){
            var logoWrapper = $(this).closest('.logo_netwrk');
            if(logoWrapper.hasClass('logo-glow')) {
                // Call ajax to set cookie
                var params = {'object': 'nw_glow_logo'};
                Ajax.setGlowCookie(params).then(function (data) {
                    var json = $.parseJSON(data);
                    if(json.success == true){
                        // Remove glow wrapper class
                        logoWrapper.removeClass('logo-glow');
                        // Destroy popover
                        logoWrapper.popover('destroy');
                    }
                });
            }

            var landingModal = $('#modal_landing_page'),
                overLay = $('.search-overlay');

            if(isMobile){
                $.when(Common.closeAllLeftSliders()).done(function() {
                    if ($('#netwrkNavigation').css('left') == '0px') {
                        $('#netwrkNavigation').animate({
                            "left": "-200px"
                        }, 500);
                        $(LandingPage.netwrk_news).animate({
                            "left": "-400px"
                        }, 500);
                        overLay.addClass('hide');
                        $('.navbar-mobile').find('.netwrk-title').removeClass('hide');
                        /*$(ChatInbox.chat_inbox).animate({
                            "left": ChatInbox.list_chat_post_right_hidden
                        }, 500);*/
                    } else {
                        $(LandingPage.netwrk_news).animate({
                            "left": "-400px"
                        }, 500);

                        overLay.removeClass('hide');
                        $('.navbar-mobile').find('.netwrk-title').addClass('hide');
                        $.when($('#netwrkNavigation').animate({
                            "left": "0"
                        }, 500));/*.done(function(){
                            ChatInbox.initialize();
                        });*/
                        Default.onClickCloseNavigation();
                    }
                });

                overLay.unbind();
                overLay.on('click', function(){
                    if ($('#netwrkNavigation').css('left') == '0px') {
                        $('#netwrkNavigation').animate({
                            "left": "-200px"
                        }, 500);
                        $('.search-overlay').addClass('hide');
                        $('.navbar-mobile').find('.netwrk-title').removeClass('hide');
                    }
                });
            }
            // Check if landing page modal open
            /*if ((landingModal.data('bs.modal') || {isShown: false}).isShown ) {
                // Hide landing page modal
                //landingModal.modal('hide');
            } else {
                // Close other open modal
                $('.modal').modal('hide');
                // Show landing page modal
                landingModal.modal('show');
            }*/

            /*if($(LandingPage.netwrk_news).css('left') == '0px'){
                $(LandingPage.netwrk_news).animate({
                    "left": "-400px"
                }, 500);
            } else {
                $(LandingPage.netwrk_news).animate({
                    "left": "0"
                }, 500);
            }*/
        });
    },

    onClickCloseNavigation: function() {
        var target = $('.landing-close-trigger');

        target.unbind();
        target.on('click',function(){
            if ($('#netwrkNavigation').css('left') == '0px') {
                $('#netwrkNavigation').animate({
                    "left": "-200px"
                }, 500);
                $('.search-overlay').addClass('hide');
                $('.navbar-mobile').find('.netwrk-title').removeClass('hide');
            }
        });
    },

    onClickNetwrkNews: function() {
        var target = $('.netwrk-news-trigger');

        target.unbind();
        target.on('click',function(){
            if(!$(this).hasClass('disabled')) {
                $.when(Common.closeAllLeftSliders()).done(function() {
                    if ($(LandingPage.netwrk_news).css('left') == '0px') {
                        $(LandingPage.netwrk_news).animate({
                            "left": "-400px"
                        }, 500);
                    } else {
                        if (isMobile) {
                            LandingPage.GetDataTopLanding();
                        } else {
                            $(LandingPage.netwrk_news).animate({
                                "left": "0px"
                            }, 500);
                            $('#netwrkNavigation').animate({
                                "left": "-200px"
                            }, 500);
                            $(ChatInbox.chat_inbox).animate({
                                "left": ChatInbox.list_chat_post_right_hidden
                            }, 500);
                        }
                    }
                });
            }
        });
    },

    show_blue_dot: function() {
        if (isMobile) {
            var action = $('.wrap-mobile').attr('data-action');
            if(action == 'home') {
                if(sessionStorage.show_blue_dot == 1) {
                    sessionStorage.show_blue_dot = 0;
                    console.log(Map.map.getZoom()+'in show blue dot and its home page'+sessionStorage.show_blue_dot);

                    if (sessionStorage.show_blue_dot_zoom12 == 1) {
                        Map.getBrowserCurrentPosition(Map.map, 'near');
                        sessionStorage.show_blue_dot_zoom12 = 0;
                    } else {
                        Map.getBrowserCurrentPosition(Map.map, 'build');
                    }
                }
            }
        }
    },
    /**
     * Show blue dot on zoom12 on mobile
     * @param map
     */
    getMylocation: function(map){
        Map.getBrowserCurrentPosition(map);
    },

    displayFacebookShareSettingModal: function() {
        // Hide all other modal
        $('.modal').modal('hide');

        // Display social email share setting modal
        var target = $('#fbEmailShareSetting');
        target.modal('show');

        // On hide display login model
        target.unbind();
        target.on('hidden.bs.modal', function() {
            window.location.hash = '';
            Login.initialize();
        });
    },
    getUserFavorites: function() {
        Ajax.show_user_joined_communities().then(function(data){
            var json = $.parseJSON(data);
            var context = '#netwrkNavigation';
            var template = $('.favorites-netwrks-wrapper', context);

            template.html('');
            console.log(json.data.length);

            //if there are no joined area, then disable netwrk_news link.
            if(!jQuery.isEmptyObject(json.data)) {
                $('.btn-netwrk-news', context).removeClass('disabled');
            } else {
                $('.btn-netwrk-news', context).addClass('disabled');
            }
            Default.getFavoriteTemplate(template, data)
        });
    },
    getFavoriteTemplate: function(parent,data){
        var json = $.parseJSON(data);
        var list_template = _.template($("#favorites-netwrks").html());
        var append_html = list_template({items: json});

        parent.append(append_html);

        var favoriteContainer = $(".your-netwrks", '#netwrkNavigation');
        if(isMobile){
            var favHeight = $(window).height()-40;
            favoriteContainer.css({'height' : favHeight, 'max-height' : favHeight});
        } else {
            var favHeight = $(window).height()-80;
            favoriteContainer.css({'height' : favHeight, 'max-height' : favHeight});
        }

        favoriteContainer.mCustomScrollbar({
            theme:"dark"
        });
        Default.eventClickCommunityTrigger();
        Default.onClickJoinHomeAreaButton();
    },
    eventClickCommunityTrigger: function(){

        var context = '#netwrkNavigation';
        var target = $('.community-modal-trigger', context);

        target.unbind();
        target.click(function(e){
            var city_id = $(e.currentTarget).attr('data-city-id');
            var zip_code = $(e.currentTarget).attr('data-zip_code');
            var lat = $(e.currentTarget).attr('data-lat');
            var lng = $(e.currentTarget).attr('data-lng');
            var cityName = $(e.currentTarget).attr('data-city_name');

            console.log(zip_code);
            var params = {'zip_code' : zip_code };
            if(isMobile){
                sessionStorage.sidebarLocation = zip_code;
                sessionStorage.lat = lat;
                sessionStorage.lng = lng;
            } else {
                //remove active class from other group
                $('.community-modal-trigger', context).removeClass('active');
                $(this).addClass('active');
                $('#area_news_tab').find('.selected-location').find('.city-name').html('').html(cityName);
            }
            Ajax.setSelectedZipCodeCookie(params).then(function (data) {
                var json = $.parseJSON(data);
                console.log(json);
                if(isMobile){
                    //var url = baseUrl + "/netwrk/topic/topic-page?city="+city_id;
                    //window.location.href= url;
                    var meetUrl = baseUrl + "/netwrk/meet";
                    var chatUrl = baseUrl + "/netwrk/chat-inbox";
                    if(window.location == meetUrl) {
                        window.location.href = meetUrl;
                    } else if(window.location == chatUrl) {
                        window.location.href= chatUrl;
                    } else {
                        $('.navbar-mobile').find('.netwrk-title').find('.netwrk-city').html(json.city);
                        Map.SetMapCenter(lat, lng, Map.map.getZoom());
                    }
                } else {
                    $('.modal').modal('hide');
                    //Topic.initialize(city_id);
                    Default.getNearByLines();
                    Default.getFeeds();

                    Map.SetMapCenter(lat, lng, Map.map.getZoom());
                }
            });
        });
    },
    getNearByLines: function() {
        Ajax.getLocalNearByLines().then(function (data) {
            var result = $.parseJSON(data);
            var localPartyParent = $(ChatInbox.chat_inbox).find('#containerLocalPartyLines ul');
            ChatInbox.getTemplateNearByLines(localPartyParent,result.localPartyLines, UserLogin);
        });
    },
    getFeeds: function() {
        //todo: get this zipcode by cookie or pass argument
        Common.initTextLoader();
        Ajax.getFeedsBySelectedZipCode().then(function (data) {
            var json = $.parseJSON(data);
            var parent = $(ChatInbox.chat_area_news).find('.content-wrapper');
            //Populate area news template with data
            Default.getFeedsTemplate(parent, json);
            Common.hideTextLoader();
        });
    },
    getFeedsTemplate: function(parent, data){
        if(!isMobile) {
            parent.find('.main-content').html('');
        } else {
            parent.html('');
        }
        var list_template = _.template($("#netwrk_news").html());
        var append_html = list_template({landing: data});
        if(!isMobile) {
            parent.find('.main-content').append(append_html);
        } else {
            parent.append(append_html);
        }
        //todo: make common code. After loading feed template initialize its post, topic clicks
        LandingPage.onTemplateLanding();
        Default.FetchEmojiOne();
    },
    FetchEmojiOne: function(data){

        if(isMobile) {
            var messages = $(ChatInbox.chat_area_news).find('.content-wrapper').find('.post .post-title');
        } else {
            var messages = $(ChatInbox.chat_area_news).find('.content-wrapper').find('.main-content').find('.post .post-title');
        }
        
        $.each(messages,function(i,e){
            Emoji.Convert($(e));
        });
    },

    onClickJoinHomeAreaButton: function() {
        // follow the user home area zipcode
        var context = '#netwrkNavigation';
        var target = $('#join-home-btn', context);
        target.unbind();
        target.click(function(e){
            var params = {'user_id': UserLogin};
            Ajax.favorite_home_community(params).then(function (data) {
                var json = $.parseJSON(data);
                if(json.success) {
                    //refresh the favorite list after join home area
                    Default.getUserFavorites();
                }
            });
        });
    }
};
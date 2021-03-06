var Search_Setting={
    setting:{
        age: '',
        gender: '',
        distance: '',
    },
    params:{
        age: 'All',
        gender: 'All',
        distance: 'All',
    },
    status_change: {
        age: false,
        gender: false,
        distance: false,
        total: false
    },
    modal:'',
    slider:'#search_setting_slider',
    slider_hidden: "-400px",
    isOpenSearchSettingSlider: false,
    areaSlider:$('#search_slider_area'),
    ageSlider:$('#search_slider_age'),
    initialize: function(){
        if(isMobile) {
            Default.SetAvatarUserDropdown();
            Search_Setting.modal = $('.profile-search-settings');
        } else {
            Search_Setting.modal = $('#modal_search_setting');

            Search_Setting.resetPage();
            Search_Setting.ShowModalSearchSetting();
        }
        Search_Setting.onClickBack();
        Search_Setting.getSearchSetting();
    },
    initializeSlider: function() {
        Search_Setting.modal = $(Search_Setting.slider);
        Search_Setting.showSearchSettingSlider();
        Search_Setting.onClickCloseSliderBtn();

        //initialize script after slider open
        Search_Setting.resetPage();
        Search_Setting.onClickBack();
        Search_Setting.getSearchSetting();
    },
    onClickBack: function(){
        var parent = Search_Setting.modal.find('.back-page span');

        parent.unbind();
        parent.click(function(){
            if(isMobile){
                window.location.href = baseUrl+ "/netwrk/profile";
            } else {
                $('.modal').modal('hide');
                //User_Profile.initialize();
                User_Profile.initializeSlider();
            }
        });
    },

    setDefaultBtn: function(){
        Search_Setting.modal.find('.btn-control .cancel').addClass('disable');
        Search_Setting.modal.find('.btn-control .save').addClass('disable');
    },

    resetPage: function(){
        Search_Setting.status_change.age = false;
        Search_Setting.status_change.gender = false;
        Search_Setting.status_change.distance = false;
        Search_Setting.status_change.total = false;
        Search_Setting.setDefaultBtn();
    },

    checkStatusChange: function(){
        if(Search_Setting.status_change.age || Search_Setting.status_change.gender || Search_Setting.status_change.distance){
            Search_Setting.status_change.total = true;
        }else if(Search_Setting.status_change.age == false && Search_Setting.status_change.gender == false && Search_Setting.status_change.distance == false){
            Search_Setting.status_change.total = false;
        }
    },

    onClickSave: function(){
        var btn = Search_Setting.modal.find('.btn-control .save');

        btn.unbind();
        if(Search_Setting.status_change.total) {
            btn.removeClass('disable');
            btn.on('click',function(){
                Ajax.updateSearchSetting(Search_Setting.params).then(function(data){
                    var json = $.parseJSON(data);

                    Search_Setting.setting.age = json.age;
                    Search_Setting.setting.gender = json.gender;
                    Search_Setting.setting.distance = json.distance;
                    Search_Setting.params.age = json.age;
                    Search_Setting.params.gender = json.gender;
                    Search_Setting.params.distance = json.distance;
                });
                Search_Setting.setDefaultBtn();
            });
        } else {
            btn.addClass('disable');
        }
    },

    onClickReset: function(){
        var btn = Search_Setting.modal.find('.btn-control .cancel');

        btn.unbind();
        if(Search_Setting.status_change.total){
            btn.removeClass('disable');
            btn.on('click',function(){
                Search_Setting.initialize();
                //Search_Setting.initializeSlider();
                Search_Setting.setDefaultBtn();
            });
        } else {
            btn.addClass('disable');
        }

    },

    _onControl: function(){
        Search_Setting.checkStatusChange();
        Search_Setting.onClickSave();
        Search_Setting.onClickReset();
    },

    genderRadio: function(){
        $.each($('input.input_radio', Search_Setting.modal),function(i,e){
            if (Search_Setting.setting.gender == $(e).val()) {
                $(e).prop('checked', true);
            }

            $(e).unbind();
            $(e).on('click',function(){
                if (Search_Setting.setting.gender != $(e).val()) {
                    Search_Setting.status_change.gender = true;
                } else if(Search_Setting.setting.gender == $(e).val()){
                    Search_Setting.status_change.gender = false;
                }

                $(e).bind();
                Search_Setting.params.gender = $(e).val();

                Search_Setting._onControl();
            })
        });
    },

    sliderArea: function(){
        var distances = ['All',25,50,100,200],
            value = 0;

        $.each(distances,function(i,e){
            if(Search_Setting.setting.distance == e){
                value = i;
                if(e == 'All'){
                    $('.search_area',Search_Setting.modal).find('.value').text(e);
                }else{
                    $('.search_area',Search_Setting.modal).find('.value').text(e + ' mi');
                }
            }
        });

        Search_Setting.areaSlider
            .slider({
                max: distances.length-1,
                min: 0,
                value: value
            })
            .slider('pips',{
                first: 'pip',
                last: 'pip'
            });

        Search_Setting.areaSlider.on("slidechange", function(e,ui) {
            Search_Setting.params.distance = distances[ui.value];

            if(Search_Setting.setting.distance != distances[ui.value]){
                Search_Setting.status_change.distance = true;
            }else{
                Search_Setting.status_change.distance = false;
            }

            if(distances[ui.value] == 'All'){
                $('.search_area',Search_Setting.modal).find('.value').text( distances[ui.value]);
            }else{
                $('.search_area',Search_Setting.modal).find('.value').text( distances[ui.value] + " mi");
            }

            Search_Setting._onControl();
        });
    },

    sliderAge: function(){
        var Ages = ['All',25,35,50,75],
            value = 0;

        $.each(Ages,function(i,e){
            if(Search_Setting.setting.age == e){
                value = i;
                if(e == 'All'){
                    $('.search_age',Search_Setting.modal).find('.value').text(e);
                }else{
                    $('.search_age',Search_Setting.modal).find('.value').text(e + '+ yrs');
                }
            }
        });

        Search_Setting.ageSlider
            .slider({
                max: Ages.length-1,
                min: 0,
                value: value
            })
            .slider('pips',{
                first: 'pip',
                last: 'pip'
            });

        Search_Setting.ageSlider.on("slidechange", function(e,ui) {
            Search_Setting.params.age = Ages[ui.value];

            if(Search_Setting.setting.age != Ages[ui.value]){
                Search_Setting.status_change.age = true;
            }else{
                Search_Setting.status_change.age = false;
            }

            if(Ages[ui.value] == 'All'){
                $('.search_age',Search_Setting.modal).find('.value').text( Ages[ui.value]);
            }else{
                $('.search_age',Search_Setting.modal).find('.value').text( Ages[ui.value] + "+ yrs");
            }
            Search_Setting._onControl();
        });
    },

    getSearchSetting: function(){
        Ajax.get_setting().then(function(data){
            var json = $.parseJSON(data);

            Search_Setting.setting.age = json.age;
            Search_Setting.setting.gender = json.gender;
            Search_Setting.setting.distance = json.distance;
            Search_Setting.params.age = json.age;
            Search_Setting.params.gender = json.gender;
            Search_Setting.params.distance = json.distance;

            Search_Setting.genderRadio();
            Search_Setting.sliderArea();
            Search_Setting.sliderAge();

        });
    },

    ShowModalSearchSetting: function(){
        var self = this;

        Search_Setting.modal.modal({
            backdrop: true,
            keyboard: false
        });

        Search_Setting.modal.on('hidden.bs.modal',function() {
            Search_Setting.modal.modal('hide');
        });
        $('.modal-backdrop.in').click(function(e) {
            Search_Setting.modal.modal('hide');
        });
    },
    showSearchSettingSlider: function() {
        //display password settling slider on right side
        Search_Setting.closeOtherSlider();
        if ($(Search_Setting.slider).css('right') == Search_Setting.slider_hidden) {
            $(Search_Setting.slider).animate({
                "right": "0"
            }, 500);

            Common.CustomScrollBar($(Search_Setting.slider));
            Search_Setting.activeResponsivePasswordSettingSlider();
        } else {
            $(Search_Setting.slider).animate({
                "right": Search_Setting.slider_hidden
            }, 500);

            Search_Setting.deactiveResponsivePasswordSettingSlider();
        }
    },
    activeResponsivePasswordSettingSlider: function() {
        var width = $( window ).width();
        $(".modal").addClass("responsive-profile-slider");
        if (width <= 1250) {
            $('#btn_meet').css('z-index', '1050');
        }

        Search_Setting.isOpenSearchSettingSlider = true;
        $('.box-navigation').css({'left': '', 'right' : '395px'});
        $('#btn_my_location').css({'left': '', 'right' : '335px'});
        $('#btn_meet').css({'left': '', 'right' : '335px'});
    },
    deactiveResponsivePasswordSettingSlider: function() {
        var width = $( window ).width();
        $(".modal").removeClass("responsive-profile-slider");

        if (width <= 1250) {
            $('#btn_meet').css('z-index', '10000');
        }

        Search_Setting.isOpenSearchSettingSlider = false;
        $('.box-navigation').css({'left': '', 'right' : '75px'});
        $('#btn_my_location').css({'left': '', 'right' : '15px'});
        $('#btn_meet').css({'left': '', 'right' : '15px'});
    },
    closeOtherSlider: function() {
        //close profile slider if it is already open
        if(User_Profile.params.isOpenProfileSlider) {
            User_Profile.initializeSlider();
        }
    },
    onClickCloseSliderBtn: function() {
        var context = Search_Setting.slider;
        var target = $('.slider-close-btn', context);
        target.unbind();
        target.click(function() {
            console.log('in onClickCloseSliderBtn clicked');
            if(Search_Setting.isOpenSearchSettingSlider) {
                Search_Setting.showSearchSettingSlider();
            }
        });
    }
};
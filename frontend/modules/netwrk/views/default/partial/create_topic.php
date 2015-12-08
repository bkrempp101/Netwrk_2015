<?php use yii\helpers\Url; ?>
<div class="modal" id='create_topic'>
    <div id="btn_discover"><img src="<?= Url::to('@web/img/icon/meet_btn.png'); ?>"/></div>
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="head">
                    <div class="back_page">
                        <span><i class="fa fa-arrow-circle-left"></i> Back </span>
                    </div>
                    <div class="name_user">
                        <p> Create a Topic</p>
                    </div>
                </div>
                <div class="scrumb">
                    <div class="logo">
                        <img src="<?= Url::to('@web/img/icon/netwrk-logo.png'); ?>">
                    </div>
                    <p class="break"> > </p>
                    <p class="zipcode"> 46975 </p>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="modal-body">
                <div class="page" id="create_topic">
                    <div class="topic">
                        <p class="title"> Topic </p>
                        <input type="text" class="name_topic" maxlength="128" placeholder="Topic Title">
                    </div>
                    <div class="post">
                        <div class="post-title">
                            <p class="title"> Post </p>
                            <div class="input-group">
                                <span class="input-group-addon" id="sizing-addon2">#</span>
                                <input type="text" class="name_post" maxlength="128" placeholder="Post Title">
                            </div>
                        </div>
                        <div class="post-message">
                            <p class="title"> Message </p>
                            <textarea class="message" placeholder="Type message here..." maxlength="1024"></textarea>
                        </div>
                    </div>
                    <div class="btn-control">
                        <div class="cancel disable">
                            <p>Reset</p>
                        </div>
                        <div class="save disable">
                            <span>Save</span>
                            <i class="fa fa-check"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
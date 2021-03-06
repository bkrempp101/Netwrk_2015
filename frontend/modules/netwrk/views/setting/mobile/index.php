<?php use yii\helpers\Url; ?>

<div id="show-meetting">
    <div class="header">
        <div class="back_page">
        <!-- <i class="fa fa-arrow-left"></i> -->
            <img src="<?= Url::to('@web/img/icon/back_btn_hdpi.png'); ?>">
        </div>
        <div class="name">
            <img src="<?= Url::to('@web/img/icon/netwrk_icon_small_hdpi.png'); ?>">
            <span>DUY QUAN</span>
        </div>
    </div>
    <div class="sidebar">
       <table class="filter_sidebar">
            <tr>
                <td class="meeting">Meeting</td>
                <td class="setting">Setting</td>
                <td class="profile ">Profile</td>
            </tr>
       </table> 
    </div>
    <div class="container_meet_setting">
        <div id="meet_page"></div>
        <div id="meet_setting">
            <div class="show_me">
                <p>Show me:</p>
                <div class="radio_gender">
                        <input type="radio" class="input_radio" name='sex' id="all" checked><label for='all'> All</label>
                        <input type="radio" class="input_radio" name='sex'id="female"><label for="female"> Female</label>
                        <input type="radio" class="input_radio" name='sex' id="male"> <label for="male"> Male </label>
                </div>
            </div>
            <div class="search_area">
                <div class="head">
                    <p class="title">Limit search Area To:</p>
                    <p class="value">50 mi</p>
                </div>
                
                <div id="circles-slider"></div>
            </div>
            <div class="search_years">
                <div class="head">
                    <p class="title">Limit search Age:</p>
                    <p class="value">20 yrs</p>
                </div>
                
                <div id="circles-slider"></div>
            </div>
        </div>
        <!-- <div id="user_setting"></div> -->
    </div>
</div>
<script type="text/javascript">
    jQuery("#circles-slider")
    .slider({
        max: 10,
        value: 5
    })
    .slider("pips");
</script>
<div class="modal" id='modal_change_avatar'>
   <div class="modal-dialog">
       <div class="modal-content">
           <div class="modal-body container_chagne_avatar">
               <div class="image-preview">
                   <p>IMAGE PREVIEW</p>
                   <img class="preview_image" src="" />
               </div>
               <div class="btn-control-modal">
                    <div class="cancel">
                        <p>Cancel</p>
                    </div>
                    <div class="save disable">
                        <i class="fa fa-check"></i>
                        <span>Save</span>
                    </div>
                    <div class="browse">
                        <?php 
                            $form = \yii\widgets\ActiveForm::begin([
                                'action' => Url::to(['/netwrk/setting/upload-image']),
                                'options' => [
                                    'id' => 'upload_image',
                                    'enctype' => 'multipart/form-data',
                                ]
                            ]);
                        ?>
                        <!-- <form id="upload_image" method="post" action="<?= Url::to(['/netwrk/setting/upload-image']) ?>" enctype="multipart/form-data"> -->
                            <input type="file" class="input_image" name='image' accept="image/jpg,image/png,image/jpeg,image/gif">
                        <!-- </form> -->
                        <?php \yii\widgets\ActiveForm::end(); ?>
                        <p>Browse</p>
                    </div>
                    
               </div>
           </div>
       </div>
   </div> 
</div>


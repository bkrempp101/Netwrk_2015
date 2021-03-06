<?php
    use yii\helpers\Url;
    use yii\helpers\Html;
    use yii\widgets\ActiveForm;
    use frontend\modules\netwrk\controllers\UserController;
    use frontend\modules\netwrk\models\User;
    use frontend\modules\netwrk\models\Profile;
?>
<div class="modal" id='signup' role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <p> Sign up </p>
            </div>
            <div class="modal-body">
                <?php
                    $scenario = 'register';
                    $session = Yii::$app->session;
                    $key_user_invitation = $session->get('key_user_invitation');

                    if($key_user_invitation) {
                        $scenario = 'join';
                    }

                    $form = ActiveForm::begin([
                        'id' => 'register-form',
                        'options' => ['class' => 'form-register form-horizontal'],
                        'fieldConfig' => [
                            'template' => "<div class=\"col-md-12\">{input}</div>\n<div class=\"col-md-12\">{error}</div>",
                            'labelOptions' => ['class' => 'col-lg-2 control-label'],
                        ],
                    ]);
                    $user = new User(["scenario" => $scenario]);
                    $profile = new Profile();

                    // $post = Yii::$app->request->post();

                    // if ($user->load($post)) {
                        // $user->validate();
                        // $profile->validate();
                    // }
                ?>
                    <div class="col-field-name field">
                        <?= $form->field($profile, 'first_name')->textInput(array('placeholder' => 'First Name','autofocus'=>true)); ?>
                    </div>
                    <div class="col-field-name field">
                        <?= $form->field($profile, 'last_name')->textInput(array('placeholder' => 'Last Name')); ?>
                    </div>

                    <?php if($scenario == 'register') : ?>
                        <div class="field-name field">
                            <?= $form->field($user, 'username')->textInput(array('placeholder' => 'Username')) ?>
                        </div>
                        <div class="field-name field">
                            <?= $form->field($user,'email')->textInput(array('placeholder' => 'Email','autocomplete'=> 'off')); ?>
                        </div>
                    <?php endif;?>

                    <?php if($scenario == 'join') : ?>
                        <input type="hidden" name="key" value="<?php echo $key_user_invitation;?>" />
                    <?php endif; ?>

                    <div class="field-name field">
                        <?= $form->field($user, 'newPassword')->passwordInput(array('placeholder' => 'Password')); ?>
                    </div>

                    <div class="col-field-name sex field">
                        <?= $form->field(
                                $profile,
                                'gender',
                                [
                                   'template'=>"<div class=\"col-md-12 input-group sex\">{input}\n
                                   <span class='input-group-addon' data-toggle='dropdown'><i class='fa fa-sort'></i></span>\n
                        <ul class='dropdown-menu' aria-labelledby='dropdownMenu2'><li>Male</li><li>Female</li></ul></div>\n<div class=\"col-md-12\">{error}</div>"
                                ])->textInput(array('placeholder' => 'Gender',"data-toggle"=>'dropdown','class'=>'form-control dropdown','readonly'=>true)); ?>
                    </div>

                    <div class="col-field-name zipcode field">
                        <?= $form->field($profile, 'zip_code')->textInput(array('placeholder' => '46140','maxlength'=>5)); ?>
                    </div>

                    <!--<div class="col-field-name age field">
                        <?/*= $form->field($profile, 'dob')->textInput(array('placeholder' => 'Age must be at least 18')); */?>
                    </div>-->
                    <?php
                        $years_to = date('Y') - 17;
                        $years_from = $years_to - 100;

                        $day = array_combine(range(1,31),range(1,31));
                        $months = array_combine(range(1,12),range(1,12));
                        $years = array_combine(range($years_from,$years_to), range($years_from,$years_to));
                    ?>
                    <div>
                        <label class="control-lable">Birthday</label>
                    </div>
                    <div class="dob-field-name dob field">
                        <?= $form->field($profile, 'day')->dropDownList($day,['prompt' => 'Day']); ?>
                    </div>
                    <div class="dob-field-name dob field">
                        <?= $form->field($profile, 'month')->dropDownList($months,['prompt' => 'Month']); ?>
                    </div>
                    <div class="dob-field-name dob year field">
                        <!--Make year 1985 as default selected -->
                        <?= $form->field($profile, 'year')->dropDownList($years,
                            ['options' => [
                                1985 => [
                                    'Selected' => 'selected'
                                ]
                            ]]
                            ); ?>
                    </div>

                    <?=  $form->field($profile, 'lat')->hiddenInput()->label(false); ?>
                    <?=  $form->field($profile, 'lng')->hiddenInput()->label(false); ?>
                <div class="btn-control">
                    <p>Sign Up</p>
                </div>
            <?php ActiveForm::end(); ?>
                <div class="sign-in">
                    <p>Already have an account! <b>Log in</b> Now</p>
                </div>
            </div>
        </div>
    </div>
</div>
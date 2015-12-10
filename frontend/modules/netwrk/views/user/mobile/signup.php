<?php
    use yii\helpers\Url;
    use yii\helpers\Html;
    use yii\widgets\ActiveForm;
?>
<div id='page-signup'>
    <div class="header">
        <p> Sign Up</p>
    </div>
    <?php if ($flash = Yii::$app->session->getFlash("Register-success")): ?>

        <div class="alert alert-success">
            <p><?= $flash ?></p>
        </div>

    <?php else: ?>

    <p><?= "Please fill out the following fields to register:" ?></p>
        <?php $form = ActiveForm::begin([
            'id' => 'register-form',
            'options' => ['class' => 'form-register form-horizontal'],
            'fieldConfig' => [
                'template' => "<div class=\"col-lg-3\">{input}</div>\n<div class=\"col-lg-7\">{error}</div>",
                'labelOptions' => ['class' => 'col-lg-2 control-label'],
            ],
            'enableAjaxValidation' => true,
        ]); ?>
        <div class="field-name">
            <?= $form->field($user, 'username')->textInput(array('placeholder' => 'Username')) ?>
        </div>
        <div class="field-name">
            <?= $form->field($user,'email')->textInput(array('placeholder' => 'Email')); ?>
        </div>
        <div class="col-field-name">
            <!-- <input type="password" class="password form-control" maxlength="128" placeholder="Password"> -->
            <?= $form->field($user, 'newPassword')->passwordInput(array('placeholder' => 'Password')); ?>
        </div>
        <div class="col-field-name">
            <?= $form->field($profile, 'first_name')->textInput(array('placeholder' => 'First name')); ?>
        </div>
        <div class="col-field-name">
            <?= $form->field($profile, 'last_name')->textInput(array('placeholder' => 'Last name')); ?>
        </div>
        <div class="col-field-name">
            <?= $form->field(
                    $profile,
                    'gender',
                    [
                       'template'=>"<div class=\"col-lg-3 input-group sex\">{input}\n
                       <span class='input-group-addon' data-toggle='dropdown'><i class='fa fa-sort'></i></span>\n
            <ul class='dropdown-menu' aria-labelledby='dropdownMenu2'><li>Male</li><li>Female</li></ul></div>\n<div class=\"col-lg-7\">{error}</div>"
                    ])->textInput(array('placeholder' => 'Gender',"data-toggle"=>'dropdown','class'=>'form-control dropdown')); ?>
        </div>
        <div class="col-field-name zipcode">
            <?= $form->field($profile, 'zip_code')->textInput(array('placeholder' => 'Zipcode')); ?>
        </div>
        <div class="col-field-name age">
            <?= $form->field($profile, 'dob')->textInput(array('placeholder' => 'Age must be at least 18')); ?>
        </div>
        <?= Html::submitButton('Sign Up', ['class' => 'btn btn-primary btn-control']) ?>
    <?php ActiveForm::end(); ?>
    <?php endif; ?>
<!--     <div class="btn-control disable">
        <p>Sign Up</p>
    </div> -->
    <div class="sign-in">
        <p>Already have an account! <a href="<?= Url::base(true); ?>/netwrk/user/login">Login</a> now</p>
    </div>
</div>
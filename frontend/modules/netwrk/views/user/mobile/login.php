<?php
    use yii\helpers\Url;
    use yii\helpers\Html;
    use yii\widgets\ActiveForm;
    use yii\authclient\widgets\AuthChoice;
?>
<div id='page-login'>

    <div class="header">
        <a href="<?= Url::base(true); ?>"><img src="<?= Url::to('@web/img/icon/netwrk-logo-blue.png'); ?>"></a>
        <p class="text-center">Log In With Your Social Account</p>
    </div>
    <div class="row social-login-wrapper">
        <div class="col-lg-12 text-center">
            <?php $authAuthChoice = AuthChoice::begin(['baseAuthUrl' => ['user/auth'], 'autoRender' => false]); ?>
                <?php foreach ($authAuthChoice->getClients() as $client): ?>
                    <?= Html::a( Html::beginTag('i',['class' => "fa fa-$client->name"]).Html::endTag('i').$client->title, ['user/auth', 'authclient'=> $client->name, ], ['class' => "btn btn-block btn-default $client->name "]) ?>
                <?php endforeach; ?>
            <?php AuthChoice::end(); ?>
        </div>
    </div>
    <hr class="or-block">
    <span class="or-text">Or</span>
    <hr class="or-block">

    <?php $form = ActiveForm::begin([
        'id' => 'login-form',
        'options' => ['class' => 'form-login form-horizontal',
                        'autocomplete'=> 'on'
                     ],
        'fieldConfig' => [
            'template' => "<div class=\"col-lg-3\">{input}</div>\n<div class=\"col-lg-7\">{error}</div>",
            'labelOptions' => ['class' => 'col-lg-2 control-label'],
        ],

    ]); ?>
    <div class="field-name">
        <p class="title"> Username </p>
        <!-- <input type="text" class="username form-control" maxlength="128" placeholder="Username"> -->
        <?= $form->field($model, 'username')->textInput(array('placeholder' => 'Username','autofocus'=>true, 'tabindex' => '1')); ?>
    </div>
    <div class="field-name password">
        <p class="title"> Password </p>
        <a href="<?= Url::base(true); ?>/netwrk/user/forgot-password" class="forgot-password">Forgot password</a>
        <!-- <input type="password" class="password form-control" maxlength="128" placeholder="Password"> -->
        <?= $form->field($model, 'password')->passwordInput(array('placeholder' => 'Password', 'tabindex' => '2')); ?>
    </div>
    <div class="btn-control" tabindex="3">
        <p>Login</p>
    </div>
    <?php ActiveForm::end(); ?>
    <div class="sign-up">
        <?php if(isset($url) && $url != Url::base(true)){?>
             <p>Don't have an account! <a href="<?= Url::base(true); ?>/netwrk/user/signup?url_callback=<?=$url?>">Sign up</a> Now</p>
        <?php }else{ ?>
            <p>Don't have an account! <a href="<?= Url::base(true); ?>/netwrk/user/signup">Sign up</a> Now</p>
        <?php } ?>
    </div>
</div>
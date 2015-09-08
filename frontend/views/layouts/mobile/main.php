<?php
use frontend\assets\AppAsset;
use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;

/* @var $this \yii\web\View */
/* @var $content string */

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
  <meta charset="<?= Yii::$app->charset ?>"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?= Html::csrfMetaTags() ?>
  <title><?= Html::encode($this->title) ?></title>
  <?php $this->head() ?>
</head>
<body>
  <?php $this->beginBody() ?>
  <div class="wrap-moblie">
    <nav class="navbar-mobile navbar-fixed-bottom">
      <div class="menu_bottom">
        <div id="btn_meet_mobile"><span>Meet</span></div>
        <a href="javascript:void(0)" class='left'>Menu</a>
        <a href="javascript:void(0)" class="right">Talking</a>
<!--         <ul class="list-menu-mobile">
          <li class="left">Menu</li>
          <li class="right">Talking</li>
        </ul> -->
      </div>
    </div>
    <?php
      // NavBar::begin([
      //   // 'brandLabel' => 'Netwrk',
      //   // 'brandUrl' => Yii::$app->homeUrl,
      //   'options' => [
      //     'class' => 'navbar-inverse navbar-fixed-bottom',
      //   ],
      // ]);
      // $menuItems = [
      //     // ['label' => 'Home', 'url' => ['/site/index']],
      //     ['label' => 'Menu', 'url' => ['/site/menu'],'class'=>"menu"],
      //     ['label' => 'Talking', 'url' => ['/site/talking'],'class'=> "talking"],
      // ];
      // // if (Yii::$app->user->isGuest) {
      // //     $menuItems[] = ['label' => 'Login', 'url' => ['/site/login']];
      // // } else {
      // //     $menuItems[] = [
      // //         'label' => 'Logout (' . Yii::$app->user->identity->username . ')',
      // //         'url' => ['/site/logout'],
      // //         'linkOptions' => ['data-method' => 'post']
      // //     ];
      // // }
      // echo Nav::widget([
      //     'options' => ['class' => 'navbar-nav navbar-right'],
      //     'items' => $menuItems,
      // ]);
      // NavBar::end();
    ?>

    <div class="container">
    <?= Breadcrumbs::widget([
      'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
    ]) ?>
    <?= $content ?>
    </div>
  </div>

  <!-- <footer class="footer">
      <div class="container">
      <p class="pull-left">&copy; Netwrk <?= date('Y') ?></p>
      <p class="pull-right"><?php //Yii::powered() ?></p>
      </div>
  </footer> -->

  <?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>

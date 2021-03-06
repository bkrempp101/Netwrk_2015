<?php

namespace frontend\modules\netwrk\controllers;

use Yii;
use frontend\components\BaseController;
use frontend\components\UtilitiesFunc;
use yii\helpers\Url;
use frontend\modules\netwrk\controllers\PostController;

class ChatInboxController extends BaseController
{

	public function actionIndex()
	{
		if($this->getIsMobile()) {
			$current = isset($_GET['current']) ? $_GET['current'] : '' ;
			if (Yii::$app->user->isGuest) {
				//return $this->redirect(['/netwrk/user/login','url_callback'=> Url::base(true).'/netwrk/chat-inbox/']);
			}
			$data = json_decode(Yii::$app->runAction('netwrk/post/get-chat-inbox'));
			return $this->render('mobile/index', ['data' => $data, 'current' => $current]);
		}
	}
}
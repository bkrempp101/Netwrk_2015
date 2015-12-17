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
		$data = json_decode(PostController::actionGetChatInbox());
		if($this->getIsMobile()) {

			if (Yii::$app->user->isGuest) {
				return $this->redirect(['/netwrk/user/login','url_callback'=> Url::base(true).'/netwrk/chat-inbox/']);
			}
			return $this->render('mobile/index', ['data' => $data]);
		}
	}
}
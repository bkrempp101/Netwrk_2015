<?php
namespace frontend\modules\netwrk\controllers;

use Yii;
use frontend\components\BaseController;
use frontend\modules\netwrk\models\User;
use frontend\modules\netwrk\models\UserKey;
use frontend\modules\netwrk\models\Role;
use frontend\modules\netwrk\models\Profile;
use frontend\modules\netwrk\models\Group;
use frontend\modules\netwrk\models\City;
use frontend\modules\netwrk\models\Favorite;
use frontend\modules\netwrk\models\Post;
use frontend\modules\netwrk\models\UserMeet;
use frontend\modules\netwrk\models\UserSettings;
use frontend\modules\netwrk\models\WsMessages;

use frontend\modules\netwrk\models\forms\AutoLoginForm;
use frontend\modules\netwrk\models\forms\LoginForm;
use frontend\modules\netwrk\models\forms\ForgotForm;

use yii\web\Response;
use yii\filters\AccessControl;
use yii\filters\VerbFilter;
use yii\widgets\ActiveForm;
use yii\db\ActiveQuery;
use yii\web\Cookie;
use yii\helpers\Url;
use yii\db\Query;

class UserController extends BaseController
{
    public $successUrl;

    /**
     * @inheritdoc
     */
    public function actions()
    {
        if($this->getIsMobile()){
            $cancelUrl = Url::to(Yii::$app->getUser()->loginUrl);
        } else {
            $cancelUrl = '/';
        }

        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'auth' => [
                'class' => 'yii\authclient\AuthAction',
                'successCallback' => [$this, 'socialLoginCallback'],
                'cancelUrl' => $cancelUrl,
            ],
        ];
    }

    /**
     * Social login
     * @param $client
     */
    public function socialLoginCallback($client)
    {
        $client_title = $client->getTitle();
        $attributes = $client->getUserAttributes();

        // Facebook social login
        if($client_title == 'Facebook') {
            $id = $attributes['id'];
            $email = strtolower($attributes['email']);
        } elseif($client_title == 'Google'){
            $id = $attributes['id'];
            $email = strtolower($attributes['emails'][0]['value']);
        }

        if($email != ''){
            $user = User::find()->where(['email' => $email]);
            if($client_title == 'Facebook' && $id != ''){
                $user = $user->orWhere(['facebook_id' => $id]);
            } elseif($client_title == 'Google' && $id != ''){
                $user = $user->orWhere(['google_id' => $id]);
            }
            $user = $user->with('profile')->one();
        } elseif($client_title == 'Facebook' && $id != '') {
            $user = User::find()->where(['facebook_id' => $id])->with('profile')->one();
        } elseif($client_title == 'Google' && $id != '') {
            $user = User::find()->where(['google_id' => $id])->with('profile')->one();
        }

        if(!empty($user)){
            // Set facebook or google id if already not set
            if($client_title == 'Facebook' && !$user->facebook_id){
                $user->facebook_id = $id;
                $user->save();
            } elseif($client_title == 'Google' && !$user->google_id){
                $user->google_id = $id;
                $user->save();
            }

            // Set profile picture if already not set
            if($client_title == 'Facebook' && $user->profile->photo == ''){
                $profile_picture = 'http://graph.facebook.com/'.$id.'/picture?height=250&width=250';
                $this->uploadSocialProfilePicture($user->id,$profile_picture);
            } elseif($client_title == 'Google' && $user->profile->photo == '') {
                $profile_picture = str_replace('sz=50','sz=250',$attributes['image']['url']);
                $this->uploadSocialProfilePicture($user->id,$profile_picture);
            }

            // Login user
            $identity = new LoginForm();
            $identity->username = $user->email;
            $identity->socialLogin(10000);
        } else {
            if($email != '') {
                // Sign up new user
                $this->SocialSignUp($attributes, $client_title);
            } else {
                if($client_title == 'Facebook'){
                    // Display facebook share email settings modal
                    $this->redirect(\yii\helpers\Url::to(['/#fb_share_email']));
                }
            }
        }
    }

    /**
     * Upload Social Profile Picture
     * @param int $user_id
     * @param string $profile_picture
     */
    public function uploadSocialProfilePicture($user_id, $profile_picture){
        // Read file data
        $post_data = file_get_contents($profile_picture);
        $extension = '.jpg';

        // Generate unique name
        $filename = $user_id . '-' . time() . $extension;

        $upload_path = \Yii::getAlias('@frontend') . "/web/uploads/".$user_id."/";
        if (!is_dir($upload_path)) {
            mkdir( $upload_path, 0777, true);
        }
        // Open a file for writing
        $fp = fopen( $upload_path . $filename, "w" );

        // Write data to the file
        fwrite($fp, $post_data);

        // Close the streams
        fclose( $fp );
        fclose( $post_data );

        // Update user profile
        $user = User::find()->where('id ='.$user_id)->one();
        $user->profile->photo = $filename;
        $user->profile->update();

        $image = Url::to('@web/uploads/'.$user_id.'/'.$user->profile->photo);
        $hash = json_encode(array('data_image'=>$image));
        return $hash;
    }

    /**
     * Social Sign Up
     * @param array $attributes
     * @param $client_title
     */
    public function SocialSignUp($attributes = array(), $client_title)
    {
        // Save user attributes in session
        $session = Yii::$app->session;
        $session['attributes'] = $attributes;

        // Prepare location data from cookie
        $cookies = Yii::$app->request->cookies;
        $zip_code = ($cookies->getValue('nw_zipCode')) ? $cookies->getValue('nw_zipCode') : 0;
        $lat = ($cookies->getValue('nw_lat')) ? $cookies->getValue('nw_lat') : '';
        $lng = ($cookies->getValue('nw_lng')) ? $cookies->getValue('nw_lng') : '';

        // Prepare data from attributes
        if($client_title == 'Facebook') {
            $id = $attributes['id'];
            $email = strtolower($attributes['email']);
            $first_name = $attributes['first_name'];
            $last_name = $attributes['last_name'];
            $gender = ($attributes['gender']) ? ucfirst($attributes['gender']) : 'null';
            $birth_day = 1;
            $birth_month = 1;
            $birth_year = date('Y') - $attributes['age_range']['min'];
            $profile_picture = 'http://graph.facebook.com/'.$id.'/picture?height=250&width=250';
        } elseif($client_title == 'Google') {
            $id = $attributes['id'];
            $email = strtolower($attributes['emails'][0]['value']);
            $first_name = $attributes['name']['givenName'];
            $last_name = $attributes['name']['familyName'];
            $gender = ($attributes['gender']) ? ucfirst($attributes['gender']) : 'null';
            $birth_date = explode('-', $attributes['birthday']);
            $birth_day = ($birth_date[2] != 00) ? $birth_date[2] : 'null';
            $birth_month = ($birth_date[1] != 00) ? $birth_date[1] : 'null';
            $birth_year = ($birth_date[0] != 0000) ? $birth_date[0] : 'null';
            $profile_picture = str_replace('sz=50','sz=250',$attributes['image']['url']);
        }

        $user_name = preg_replace('/[^A-Za-z0-9\-]/', '',preg_replace('/([^@]*).*/', '$1', $email));
        $new_username = $this->checkUserName($user_name);

        $post = [
            'Profile' => [
                'first_name' => $first_name,
                'last_name' => $last_name,
                'gender' => $gender,
                'day' => strval($birth_day),
                'month' => strval($birth_month),
                'year' => strval($birth_year),
                'zip_code' => $zip_code,
                'lat' => $lat,
                'lng' => $lng
            ],
            'User' => [
                'username' => $new_username,
                'email' => $email,
                'newPassword' => $first_name.''.$last_name
            ]
        ];

        // Create instance of User and Profile for sign up
        $user = new User(["scenario" => "register"]);
        $profile = new Profile();

        // Load user and profile data
        if ($user->load($post) && $profile->load($post)) {
            // validate for normal request
            if ($user->validate() && $profile->validate() && $zip_code) {
                if($client_title == 'Facebook'){
                    $user->facebook_id = $id;
                } elseif($client_title == 'Google'){
                    $user->google_id = $id;
                }

                $user->setRegisterAttributes(Role::ROLE_USER, Yii::$app->request->userIP)->save(false);
                $profile->zip_code = $zip_code;
                $profile->lat = $lat;
                $profile->lng = $lng;
                $profile->setUser($user->id)->save(false);
                $this->afterSignUp($user);

                // Set profile picture
                $this->uploadSocialProfilePicture($user->id,$profile_picture);

                // Auto follow user to his zip code social community
                $city = City::find()->select('city.*')
                    ->where(['zip_code' => $zip_code])
                    ->andWhere('office_type is null')
                    ->one();

                $favorite = new Favorite;
                $favorite->user_id = $user->id;
                $favorite->type = 'city';
                $favorite->city_id = $city->id;
                $favorite->status = 1;
                $favorite->created_at = date('Y-m-d H:i:s');
                $favorite->save();

                // Login newly sign up user
                $identity = new LoginForm();
                $identity->username = $email;
                $identity->socialLogin(10000);

                $c = Yii::$app->response->cookies;
                $cookie = new Cookie(['name'=>'nw_social_sign_up', 'value'=> 1]);
                $c->add($cookie);
            }
        }
    }

    /**
     * Forgot password
     */
    public function actionForgotPassword(){
        $model = new ForgotForm();

        if ($model->load(Yii::$app->request->post()) && $model->sendForgotEmail()) {
            // set flash (which will show on the current page)
            Yii::$app->session->setFlash("Forgot-success", "A password reset email has been sent. Please check your inbox");
            $data = array('status' => 1,'data'=>$model,'message'=> "A password reset email has been sent. Please check your inbox");
        }else{
            $data = array('status' => 0,'data'=>$model['_errors']);
        }
        // render
        if($this->getIsMobile()){
            return $this->render($this->getIsMobile() ? 'mobile/forgot_password' : $this->goHome(),[
                "model" => $model,
            ]);
        }else{
            $hash = json_encode($data);
            return $hash;
        }
    }

    /**
     * Forgot password
     */
    public function actionResetPassword($key){
        $session = Yii::$app->session;
        $userKey = new UserKey();
        $model = new LoginForm(); 
        $userKey = UserKey::findActiveByKey($key, $userKey::TYPE_PASSWORD_RESET);
        if (!$userKey) {
            if($this->getIsMobile()){
                return $this->render($this->getIsMobile() ? 'mobile/reset_password' : $this->goHome(), ["invalidKey" => true]);
            }else{
                $session['key_reset_password']= $key;
                $session['invalidKey'] = true;
                return $this->goHome();
            }
        }

        // get user and set "reset" scenario
        $success = false;
        $user = new User();
        $user = $user::findOne($userKey->user_id);
        $user->setScenario("reset");

        // load post data and reset user password
        if ($user->load(Yii::$app->request->post()) && $user->save()) {

            // consume userKey and set success = true
            $userKey->consume();
            $success = true;
        }

        // render
        if($this->getIsMobile()){
            if($success){
                return $this->redirect(['user/login']);
            }else{
                return $this->render($this->getIsMobile() ? 'mobile/reset_password' : $this->goHome(),compact("user", "success"));
            }
        }else{
            $session['key_reset_password']= $key;
            return $this->goHome();
        }
    }

    public function actionUserResetPassword(){
        $data = [];
        $key = $_POST['key'];
        $newPassword = $_POST['newPassword'];
        $newPasswordConfirm = $_POST['newPasswordConfirm'];

        $userKey = new UserKey();
        $userKey = UserKey::findActiveByKey($key, $userKey::TYPE_PASSWORD_RESET);
        // get user and set "reset" scenario
        $success = false;
        $user = new User();
        $user = $user::findOne($userKey->user_id);
        $user->setScenario("reset");

        $user->newPassword = $newPassword;
        $user->newPasswordConfirm = $newPasswordConfirm;
        // load post data and reset user password
        if ($user->save()) {

            // consume userKey and set success = true
            $userKey->consume();
            $success = true;
            $data = ['status'=> 1];
        }else{
            $data = ['status'=> 0,'data'=> $user];
        }

        // render
        $hash = json_encode($data);
        return $hash;
    }

    public function actionResetSession(){
        unset(Yii::$app->session['key_reset_password']);
        unset(Yii::$app->session['invalidKey']);
        Yii::$app->session->destroy();
    }
    /**
     * Display login page
     */
    public function actionLogin()
    {
        /** @var \amnah\yii2\user\models\forms\LoginForm $model */
        $url_callback='';
        if(isset($_GET['url_callback'])){
           $url_callback =  $_GET['url_callback'];
           if (isset($_GET['chat_type'])) {
               $url_callback = $url_callback. '&chat_type='.$_GET['chat_type'];
           }
        }
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        // load post data and login
        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login(Yii::$app->getModule("netwrk")->loginDuration)) {
            if($url_callback){
                Yii::$app->getResponse()->redirect($url_callback)->send();
            }else{
                return $this->goHome();
            }
        }

        return $this->render($this->getIsMobile() ? 'mobile/login' : $this->goHome(),[
        	'model' => $model,
            'url' => $url_callback
        ]);
    }

    public function actionLoginUser(){
        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login(Yii::$app->getModule("netwrk")->loginDuration)) {
            $data = array('status' => 1,'data'=>Yii::$app->user->id);
        }else{
            $data = array('status' => 0,'data'=>$model['_errors']);
        }
        $hash = json_encode($data);
        return $hash;
    }

    public function actionSignupUser(){

        $user = new User(["scenario" => "register"]);
        $profile = new Profile();

        // load post data
        $post = Yii::$app->request->post();
        $post['User']['email'] = strtolower($post['User']['email']);

        if ($user->load($post) && $profile->load($post)) {
            // ensure profile data gets loaded
            // validate for ajax request
            $zipcode = $post['Profile']['zip_code'];
            $lat = $post['Profile']['lat'];
            $lng = $post['Profile']['lng'];

            $form = ActiveForm::validate($user, $profile);
            // validate for normal request
            if ($user->validate() && $profile->validate() && $zipcode) {
                // perform registration
                $user->setRegisterAttributes(Role::ROLE_USER, Yii::$app->request->userIP)->save(false);
                $profile->zip_code = $zipcode;
                $profile->lat = $lat;
                $profile->lng = $lng;
                $profile->setUser($user->id)->save(false);
                $this->afterSignUp($user);

                /*$city = City::find()->select('city.*')
                    ->where(['zip_code' => $zipcode])
                    ->andWhere('office_type is null')
                    ->one();

                $favorite = new Favorite;
                $favorite->user_id = $user->id;
                $favorite->type = 'city';
                $favorite->city_id = $city->id;
                $favorite->status = 1;
                $favorite->created_at = date('Y-m-d H:i:s');
                $favorite->save();*/
                $data = array('status' => 1,'data'=>Yii::$app->user->id);
            }else{
                $data = array('status' => 0,'data'=>$form);
            }
        }

        $hash = json_encode($data);
        return $hash;
    }

    public function actionSignup()
    {
        $url_callback='';
        if(isset($_GET['url_callback'])){
           $url_callback =  $_GET['url_callback'];
        }
        $user = new User(["scenario" => "register"]);
        $profile = new Profile();
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }
        // load post data
        $post = Yii::$app->request->post();
        if ($user->load($post)) {
            // ensure profile data gets loaded
            $zipcode = $post['Profile']['zip_code'];
            $lat = $post['Profile']['lat'];
            $lng = $post['Profile']['lng'];
            $profile->load($post);

            // validate for ajax request
            if (Yii::$app->request->isAjax) {
                Yii::$app->response->format = Response::FORMAT_JSON;
                return ActiveForm::validate($user, $profile);
            }

            // validate for normal request
            if ($user->validate() && $profile->validate() && $zipcode) {

                // perform registration
                $user->setRegisterAttributes(Role::ROLE_USER, Yii::$app->request->userIP)->save(false);
                $profile->zip_code = $zipcode;
                $profile->lat = $lat;
                $profile->lng = $lng;
                $profile->setUser($user->id)->save(false);
                $this->afterSignUp($user);

                $city = City::find()->select('city.*')
                    ->where(['zip_code' => $zipcode])
                    ->andWhere('office_type is null')
                    ->one();

                $favorite = new Favorite;
                $favorite->user_id = $user->id;
                $favorite->type = 'city';
                $favorite->city_id = $city->id;
                $favorite->status = 1;
                $favorite->created_at = date('Y-m-d H:i:s');
                $favorite->save();

                if($url_callback != ''){
                    Yii::$app->getResponse()->redirect($url_callback)->send();
                }else{
                    return $this->goHome();
                }
            }
        }

        // render
        return $this->render($this->getIsMobile() ? 'mobile/signup' : $this->goHome(), [
            'user'    => $user,
            'profile' => $profile,
            'url'=> $url_callback
        ]);
    }

    public function afterSignUp($user)
    {
        /** @var \amnah\yii2\user\models\UserKey $userKey */

        // determine userKey type to see if we need to send email
        if ($user->status == $user::STATUS_INACTIVE) {
            $userKeyType = UserKey::TYPE_EMAIL_ACTIVATE;
        } elseif ($user->status == $user::STATUS_UNCONFIRMED_EMAIL) {
            $userKeyType = UserKey::TYPE_EMAIL_CHANGE;
        } else {
            $userKeyType = null;
        }

        // check if we have a userKey type to process, or just log user in directly
        if ($userKeyType) {

            // generate userKey and send email
            $userKey = UserKey::generate($user->id, $userKeyType);
            if (!$numSent = $user->sendEmailConfirmation($userKey)) {

                // handle email error
                Yii::$app->session->setFlash("Email-error", "Failed to send email");
            }
        } else {
            Yii::$app->user->login($user, Yii::$app->getModule("netwrk")->loginDuration);
        }
    }

    public function actionConfirm($key)
    {
        /** @var \amnah\yii2\user\models\UserKey $userKey */
        /** @var \amnah\yii2\user\models\User $user */

        // search for userKey
        $success = false;
        $userKey = new UserKey();
        $userKey = $userKey::findActiveByKey($key, [$userKey::TYPE_EMAIL_ACTIVATE, $userKey::TYPE_EMAIL_CHANGE]);
        if ($userKey) {

            // confirm user
            $user = new User();
            $user = $user::findOne($userKey->user_id);
            $user->confirm();

            // consume userKey and set success
            $userKey->consume();
            $success = $user->email;
        }

        // render
        return $this->render("confirm", [
            "userKey" => $userKey,
            "success" => $success
        ]);
    }

    /**
     * [Function is used to sign out]
     * @return             [homepage]
     */

    public function actionLogout()
    {
        $user = Yii::$app->user;
        if (!$user->isGuest) {
            $user->logout();
            return $this->goHome();
        }
    }

    /**
     * Join invited user
     */
    public function actionJoin($key){
        $session = Yii::$app->session;
        $userKey = new UserKey();

        $userKey = UserKey::findActiveByKey($key, $userKey::TYPE_USER_INVITATION);
        if (!$userKey) {
            if($this->getIsMobile()){
                //return $this->render($this->getIsMobile() ? 'mobile/reset_password' : $this->goHome(), ["invalidKey" => true]);
            }else{
                $session['key_user_invitation']= $key;
                $session['invalidKey'] = true;
                return $this->goHome();
            }
        }

        // get user and set "join" scenario
        $success = false;
        $user = new User();
        $user = $user::findOne($userKey->user_id);
        $user->setScenario("join");

        // Get city details for invited user
        $group = Group::GetInvitedGroupIdByUser($user->id);
        $city = City::GetCityByGroupId($group);

        // load post data and reset user password
        $profile = new Profile();

        // load post data
        $post = Yii::$app->request->post();
        if ($user->load($post) && $profile->load($post)) {
            // ensure profile data gets loaded
            // validate for ajax request
            $zipcode = $post['Profile']['zip_code'];
            $lat = $post['Profile']['lat'];
            $lng = $post['Profile']['lng'];
            $first_name = $post['Profile']['first_name'];
            $last_name = $post['Profile']['last_name'];

            $form = ActiveForm::validate($user, $profile);
            // validate for normal request
            if ($user->validate() && $profile->validate() && $zipcode) {
                // perform updation
                $user->setRegisterAttributes(Role::ROLE_USER, Yii::$app->request->userIP)->save(false);
                $profile->zip_code = $zipcode;
                $profile->lat = $lat;
                $profile->lng = $lng;
                $profile->setUser($user->id)->save(false);
                $this->afterSignUp($user);

                //auto follow 
                $city = City::find()->select('city.*')
                    ->where(['zip_code' => $zipcode])
                    ->andWhere('office_type is null')
                    ->one();
                $favorite = new Favorite;
                $favorite->user_id = $user->id;
                $favorite->type = 'city';
                $favorite->city_id = $city->id;
                $favorite->status = 1;
                $favorite->created_at = date('Y-m-d H:i:s');
                $favorite->save();

                // consume userKey
                $userKey->consume();

                // Add ws_message of user joined netwrk, so that group chat will be display in discussion
                $ws_messages = new WsMessages();
                $ws_messages->user_id = $user->id;
                $ws_messages->msg = $first_name.' '.$last_name.' has joined Netwrk';
                $ws_messages->post_id = $city['post_id'];
                $ws_messages->msg_type = 1;
                $ws_messages->post_type = 1;
                $ws_messages->save(false);

                if($this->getIsMobile()){
                    $this->redirect('/netwrk/chat/chat-post?post='.$city['post_id'].'&chat_type=1&previous-flag=1&welcome=true');
                } else {
                    $data = array('status' => 1,'data'=>Yii::$app->user->id,'post_id'=>$city['post_id']);
                }
            }else{
                $data = array('status' => 0,'data'=>$form);
            }

            $hash = json_encode($data);
            return $hash;
        }

        // Set cookie so cover page checking will exclude
        $c = Yii::$app->response->cookies;

        $cookie = new Cookie(['name'=>'nw_zipCode', 'value'=> $city['zip_code'], 'expire'=> (time()+(365*86400))]);
        $c->add($cookie);
        $cookie = new Cookie(['name'=>'nw_city', 'value'=> $city['city_name'], 'expire'=> (time()+(365*86400))]);
        $c->add($cookie);
        $cookie = new Cookie(['name'=>'nw_lat', 'value'=> $city['lat'], 'expire'=> (time()+(365*86400))]);
        $c->add($cookie);
        $cookie = new Cookie(['name'=>'nw_lng', 'value'=> $city['lng'], 'expire'=> (time()+(365*86400))]);
        $c->add($cookie);
        $cookie = new Cookie(['name'=>'nw_state', 'value'=> $city['state'], 'expire'=> (time()+(365*86400))]);
        $c->add($cookie);
        $cookie = new Cookie(['name'=>'nw_stateAbbr', 'value'=> $city['state_abbreviation'], 'expire'=> (time()+(365*86400))]);
        $c->add($cookie);
        $cookie = new Cookie(['name'=>'isCoverPageVisited', 'value'=> 1, 'expire'=> (time()+(365*86400))]);
        $c->add($cookie);
        $cookie = new Cookie(['name'=>'isAccepted', 'value'=> 1, 'expire'=> (time()+(365*86400))]);
        $c->add($cookie);

        // render
        if($this->getIsMobile()){
            if($success){
                return $this->redirect(['user/login']);
            }else{
                return $this->render('mobile/signup', [
                    'user'    => $user,
                    'profile' => $profile,
                    'scenario' => 'join'
                ]);
            }
        }else{
            $session['key_user_invitation']= $key;
            return $this->goHome();
        }
    }

    /**
     * Reset timeless count on every 1st of month
     */
    public function actionResetTimeless(){
        $users = User::find()->where('timeless_count > 0')->all();

        foreach ($users as $user) {
            $user->timeless_count = 0;
            $user->save();
        }
    }

    public function newUsername($existing_users, $username, $i) {
        $updated_username = $username.$i;

        if(in_array($updated_username, $existing_users)) {
            $i++;
            return $this->newUsername($existing_users, $username, $i);
        } else {
            return $updated_username;
        }
    }

    private function checkUserName($userName = null)
    {
        if($userName) {
            $updatedUserName = '';

            $existing_users = array();
            $query = new Query();
            $users = $query->select('user.username')
                ->from('user')
                ->andFilterWhere(['like', 'username', $userName])
                ->all();

            foreach($users as $user){
                array_push($existing_users, $user['username']);
            }

            $updatedUserName = $this->newUsername($existing_users, $userName, 1);

            return $updatedUserName;
        }
    }
}


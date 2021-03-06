<?php

namespace frontend\modules\netwrk\models;

use Yii;
use yii\helpers\Url;
use yii\base\Behavior;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;
use yii\swiftmailer\Mailer;
use yii\swiftmailer\Message;
use yii\helpers\Inflector;
use ReflectionClass;

/**
 * This is the model class for table "user".
 *
 * @property integer $id
 * @property integer $role_id
 * @property integer $status
 * @property string $email
 * @property string $new_email
 * @property string $username
 * @property string $password
 * @property string $auth_key
 * @property string $api_key
 * @property string $login_ip
 * @property string $login_time
 * @property string $create_ip
 * @property string $create_time
 * @property string $update_time
 * @property string $ban_time
 * @property string $ban_reason
 * @property integer $timeless_count
 * @property integer $facebook_id
 */
class User extends ActiveRecord implements IdentityInterface
{
    /**
     * @var int Inactive status
     */
    const STATUS_INACTIVE = 0;

    /**
     * @var int Active status
     */
    const STATUS_ACTIVE = 1;

    /**
     * @var int Unconfirmed email status
     */
    const STATUS_UNCONFIRMED_EMAIL = 2;

    /**
     * @var int status incomplete
     */
    const STATUS_INCOMPLETE = 3;

    /**
     * @var string Current password - for account page updates
     */
    public $currentPassword;

    /**
     * @var string New password - for registration and changing password
     */
    public $newPassword;

    /**
     * @var string New password confirmation - for reset
     */
    public $newPasswordConfirm;

    /**
     * @var string New password - for changing password from profile
     */
    public $newPasswordProfile;

    /**
     * @var string New password confirmation - for changing password from profile
     */
    public $newPasswordConfirmProfile;

    /**
     * @var array Permission cache array
     */
    protected $_access = [];

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        $rules = [
            // general email and username rules
            [['email', 'username'], 'required', 'message'=> 'This is required field.'],
            [['username'], 'string', 'max' => 255,'min'=> 4,'message'=> '{attribute} must be at least 4 characters long'],
            [['email'], 'string', 'max' => 255,'message'=> '{attribute} is invalid'],
            [['email', 'username'], 'unique'],
            [['email', 'username'], 'filter', 'filter' => 'trim'],
            [['email'], 'email'],
            [['username'], 'match', 'pattern' => '/^[A-Za-z0-9_]+$/u', 'message' => '{attribute} can contain only letters, numbers, and "_"'],
            // password rules
            [['newPassword'], 'string', 'min'=> 8, 'max'=> 255,'message'=> 'Password should contain at least 8 characters.'],
            [['newPassword'], 'filter', 'filter' => 'trim'],
            [['newPassword'], 'required', 'on' => ['register', 'reset', 'join'],'message'=>'Password should contain at least 8 characters.'],
            [['newPasswordConfirm'], 'required', 'on' => ['reset']],
            [['newPasswordConfirm'], 'compare', 'compareAttribute' => 'newPassword', 'message' => 'Passwords do not match'],

            [['newPasswordProfile'], 'string', 'min'=> 8, 'max'=> 255,'message'=> 'Password should contain at least 8 characters.'],
            [['newPasswordProfile'], 'filter', 'filter' => 'trim'],
            [['newPasswordProfile'], 'required', 'on' => ['password_setting'],'message'=>'Password should contain at least 8 characters.'],
            [['newPasswordConfirmProfile'], 'required', 'on' => ['password_setting']],
            [['newPasswordConfirmProfile'], 'compare', 'compareAttribute' => 'newPasswordProfile', 'message' => 'Passwords do not match'],


            // account page
            [['currentPassword'], 'required', 'on' => ['account', 'password_setting']],
            [['currentPassword'], 'validateCurrentPassword', 'on' => ['account', 'password_setting']],

            // admin crud rules
            [['role_id', 'status'], 'required', 'on' => ['admin']],
            [['role_id', 'status'], 'integer', 'on' => ['admin']],
            [['ban_time'], 'integer', 'on' => ['admin']],
            [['ban_reason'], 'string', 'max' => 255, 'on' => 'admin'],
        ];

        // add required rules for email/username depending on module properties
        $requireFields = ["requireEmail", "requireUsername"];
        foreach ($requireFields as $requireField) {
            if (Yii::$app->getModule("netwrk")->$requireField) {
                $attribute = strtolower(substr($requireField, 7)); // "email" or "username"
                $rules[]   = [$attribute, "required"];
            }
        }

        return $rules;
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'role_id' => 'Role ID',
            'status' => 'Status',
            'email' => 'Email',
            'new_email' => 'New Email',
            'username' => 'Username',
            'password' => 'Password',
            'auth_key' => 'Auth Key',
            'api_key' => 'Api Key',
            'login_ip' => 'Login Ip',
            'login_time' => 'Login Time',
            'create_ip' => 'Create Ip',
            'create_time' => 'Create Time',
            'update_time' => 'Update Time',
            'ban_time' => 'Ban Time',
            'ban_reason' => 'Ban Reason',
            'timeless_count' => 'Timeless Count',

            // virtual attributes set above
            'currentPassword' => 'Current Password',
            'newPassword'     => 'Password',
            'newPasswordConfirm' => 'Password Confirm',

            'newPasswordProfile'     => 'Password',
            'newPasswordConfirmProfile' => 'Password Confirm',

            'facebook_id' => "Facebook Id"
        ];
    }
    public function behaviors()
    {
        return [
            'timestamp' => [
                'class'      => 'yii\behaviors\TimestampBehavior',
                'value'      => function () { return date("Y-m-d H:i:s"); },
                'attributes' => [
                    ActiveRecord::EVENT_BEFORE_INSERT => 'create_time',
                    ActiveRecord::EVENT_BEFORE_UPDATE => 'update_time',
                ],
            ],
        ];
    }
    /**
     * Validate current password (account page)
     */
    public function validateCurrentPassword()
    {
        if (!$this->validatePassword($this->currentPassword)) {
            $this->addError("currentPassword", "Current password incorrect");
        }
    }

    //Get Url avatar User have photo
    public function GetUrlAvatar($id,$photo)
    {
        $url = Url::to('@web/img/icon/no_avatar.jpg');
        // $user = User::findOne($id);
        // $photo = $user->profile->photo;
        if($photo){
            $url = Url::to('@web/uploads/'.$id.'/'.$photo);
        }
        return $url;
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getProfile()
    {
        return $this->hasOne(Profile::className(), ['user_id' => 'id']);
    }

    public function getSetting()
    {
        return $this->hasOne(UserSettings::className(), ['user_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRole()
    {
        $role = Yii::$app->getModule("netwrk")->model("Role");
        return $this->hasOne(Role::className(), ['id' => 'role_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUserKeys()
    {
        $userKey = Yii::$app->getModule("netwrk")->model("UserKey");
        return $this->hasMany(UserKey::className(), ['user_id' => 'id']);
    }

    public function getUserAuths()
    {
        return $this->hasMany(UserAuth::className(), ['user_id' => 'id']);
    }

    public static function findIdentity($id)
    {
        return self::findOne($id);
    }

    public static function findIdentityByAccessToken($token, $type = null)
    {
        return static::findOne(["api_key" => $token]);
    }

    public function getId()
    {
        return $this->id;
    }
    public function getCurrent()
    {
        $current = $this->id;
        return $current;
    }
    /**
     * @inheritdoc
     */
    public function getAuthKey()
    {
        return $this->auth_key;
    }

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey)
    {
        return $this->auth_key === $authKey;
    }

    /**
     * Verify password
     *
     * @param string $password
     * @return bool
     */
    public function validatePassword($password)
    {
        return Yii::$app->security->validatePassword($password, $this->password);
    }

    /**
     * @inheritdoc
     */
    public function beforeSave($insert)
    {
        // check if we're setting $this->password directly
        // handle it by setting $this->newPassword instead
        $dirtyAttributes = $this->getDirtyAttributes();
        if (isset($dirtyAttributes["password"])) {
            $this->newPassword = $dirtyAttributes["password"];
        }

        // hash new password if set
        if ($this->newPassword) {
            $this->password = Yii::$app->security->generatePasswordHash($this->newPassword);
        }

        if (isset($dirtyAttributes["password"])) {
            $this->newPasswordProfile = $dirtyAttributes["password"];
        }

        // hash new password if set
        if ($this->newPasswordProfile) {
            $this->password = Yii::$app->security->generatePasswordHash($this->newPasswordProfile);
        }

        // convert ban_time checkbox to date
        if ($this->ban_time) {
            $this->ban_time = date("Y-m-d H:i:s");
        }

        // ensure fields are null so they won't get set as empty string
        $nullAttributes = ["email", "username", "ban_time", "ban_reason"];
        foreach ($nullAttributes as $nullAttribute) {
            $this->$nullAttribute = $this->$nullAttribute ? $this->$nullAttribute : null;
        }

        return parent::beforeSave($insert);
    }

    /**
     * Set attributes for registration
     *
     * @param int    $roleId
     * @param string $userIp
     * @param string $status
     * @return static
     */
    public function setRegisterAttributes($roleId, $userIp, $status = null)
    {
        // set default attributes
        $attributes = [
            "role_id"   => $roleId,
            "create_ip" => $userIp,
            "auth_key"  => Yii::$app->security->generateRandomString(),
            "api_key"   => Yii::$app->security->generateRandomString(),
            "status"    => static::STATUS_ACTIVE,
        ];

        // determine if we need to change status based on module properties
        $emailConfirmation = Yii::$app->getModule("netwrk")->emailConfirmation;
        $requireEmail      = Yii::$app->getModule("netwrk")->requireEmail;
        $useEmail          = Yii::$app->getModule("netwrk")->useEmail;
        if ($status) {
            $attributes["status"] = $status;
        }
        elseif ($emailConfirmation && $requireEmail) {
            $attributes["status"] = static::STATUS_ACTIVE;
        }
        elseif ($emailConfirmation && $useEmail && $this->email) {
            $attributes["status"] = static::STATUS_UNCONFIRMED_EMAIL;
        }

        // set attributes and return
        $this->setAttributes($attributes, false);
        return $this;
    }

    /**
     * Check and prepare for email change
     *
     * @return bool True if user set a `new_email`
     */
    public function checkAndPrepEmailChange()
    {
        // check if user is removing email address (only if Module::$requireEmail = false)
        if (trim($this->email) === "") {
            return false;
        }

        // check for change in email
        if ($this->email != $this->getOldAttribute("email")) {

            // change status
            $this->status = static::STATUS_UNCONFIRMED_EMAIL;

            // set `new_email` attribute and restore old one
            $this->new_email = $this->email;
            $this->email     = $this->getOldAttribute("email");

            return true;
        }

        return false;
    }

    /**
     * Update login info (ip and time)
     *
     * @return bool
     */
    public function updateLoginMeta()
    {
        // set data
        $this->login_ip   = Yii::$app->getRequest()->getUserIP();
        $this->login_time = date("Y-m-d H:i:s");

        // save and return
        return $this->save(false, ["login_ip", "login_time"]);
    }

    /**
     * Confirm user email
     *
     * @return bool
     */
    public function confirm()
    {
        // update status
        $this->status = static::STATUS_ACTIVE;

        // update new_email if set
        if ($this->new_email) {
            $this->email     = $this->new_email;
            $this->new_email = null;
        }

        // save and return
        return $this->save(false, ["email", "new_email", "status"]);
    }

    /**
     * Check if user can do specified $permission
     *
     * @param string    $permissionName
     * @param array     $params
     * @param bool      $allowCaching
     * @return bool
     */
    public function can($permissionName, $params = [], $allowCaching = true)
    {
        // check for auth manager rbac
        $auth = Yii::$app->getAuthManager();
        if ($auth) {
            if ($allowCaching && empty($params) && isset($this->_access[$permissionName])) {
                return $this->_access[$permissionName];
            }
            $access = $auth->checkAccess($this->getId(), $permissionName, $params);
            if ($allowCaching && empty($params)) {
                $this->_access[$permissionName] = $access;
            }

            return $access;
        }

        // otherwise use our own custom permission (via the role table)
        return $this->role->checkPermission($permissionName);
    }

    /**
     * Get display name for the user
     *
     * @var string $default
     * @return string|int
     */
    public function getDisplayName($default = "")
    {
        // define possible fields
        $possibleNames = [
            "username",
            "email",
            "id",
        ];

        // go through each and return if valid
        foreach ($possibleNames as $possibleName) {
            if (!empty($this->$possibleName)) {
                return $this->$possibleName;
            }
        }

        return $default;
    }

    /**
     * Send email confirmation to user
     *
     * @param UserKey $userKey
     * @return int
     */
    public function sendEmailConfirmation($userKey)
    {
        /** @var Mailer $mailer */
        /** @var Message $message */

        // modify view path to module views
        $mailer           = Yii::$app->mailer;
        $oldViewPath      = $mailer->viewPath;
        $mailer->viewPath = Yii::$app->getModule("netwrk")->emailViewPath;
        // send email
        $user    = $this;
        $profile = $user->profile;
        $email   = $user->new_email !== null ? $user->new_email : $user->email;
        $subject = " - Email Confirmation";
        $message  = $mailer->compose('confirmEmail', compact("subject", "user", "profile", "userKey"))
            ->setTo($email)
            ->setSubject($subject);

        // check for messageConfig before sending (for backwards-compatible purposes)
        if (empty($mailer->messageConfig["from"])) {
            $message->setFrom(Yii::$app->params["adminEmail"]);
        }
        $result = $message->send();

        // restore view path and return result
        $mailer->viewPath = $oldViewPath;
        return $result;
    }

    /**
     * Get list of statuses for creating dropdowns
     *
     * @return array
     */
    public static function statusDropdown()
    {
        // get data if needed
        static $dropdown;
        if ($dropdown === null) {

            // create a reflection class to get constants
            $reflClass = new ReflectionClass(get_called_class());
            $constants = $reflClass->getConstants();

            // check for status constants (e.g., STATUS_ACTIVE)
            foreach ($constants as $constantName => $constantValue) {

                // add prettified name to dropdown
                if (strpos($constantName, "STATUS_") === 0) {
                    $prettyName               = str_replace("STATUS_", "", $constantName);
                    $prettyName               = Inflector::humanize(strtolower($prettyName));
                    $dropdown[$constantValue] = $prettyName;
                }
            }
        }

        return $dropdown;
    }

    public static function getRandomUser($expect)
    {
        $users = User::find()
                ->addSelect(["*", "RAND() order_num"])
                ->where('id NOT IN ('.$expect.')')
                ->with('profile')
                ->orderBy(['order_num'=> SORT_DESC])
                ->all();
    }
}

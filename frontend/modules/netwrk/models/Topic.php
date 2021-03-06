<?php

namespace frontend\modules\netwrk\models;

use Yii;
use yii\base\Behavior;
use yii\db\Query;
use yii\db\ActiveRecord;
/**
 * This is the model class for table "topic".
 *
 * @property integer $id
 * @property integer $city_id
 * @property integer $group_id
 * @property integer $user_id
 * @property string $title
 * @property integer $post_count
 * @property integer $view_count
 * @property string $created_at
 * @property string $updated_at
 */
class Topic extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'topic';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'title'], 'required'],
            [['city_id', 'group_id', 'user_id', 'post_count', 'view_count','brilliant_count'], 'integer'],
            [['created_at', 'updated_at'], 'safe'],
            [['title'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'city_id' => 'City ID',
            'user_id' => 'User ID',
            'title' => 'Title',
            'post_count' => 'Post Count',
            'view_count' => 'View Count',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
            'brilliant_count'=> 'Brilliant Count',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCity()
    {
        return $this->hasOne(City::className(), ['id' => 'city_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getGroup()
    {
        return $this->hasOne(Group::className(), ['id' => 'group_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPosts()
    {
        return $this->hasMany(Post::className(), ['topic_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    // public function beforeSave($insert){
    //     if ($insert) {
    //         $user_exits = Topic::find()->where(['user_id'=> 1,'city_id'=>$this->city_id])->one();
    //         if(!$user_exits){
    //             $this->city->updateAttributes([
    //                 'user_count' =>  $this->city->user_count + 1
    //             ]);
    //         }
    //     }
    //     return parent::beforeSave($insert);
    // }

        /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'timestamp' => [
                'class'      => 'yii\behaviors\TimestampBehavior',
                'value'      => function () { return date("Y-m-d H:i:s"); },
                'attributes' => [
                    ActiveRecord::EVENT_BEFORE_INSERT => 'created_at',
                    ActiveRecord::EVENT_BEFORE_UPDATE => 'updated_at',
                ],
            ],
        ];
    }

    public function SearchTopic($_search,$type,$except){
        $limit = Yii::$app->params['LimitResultSearch'];
        if(isset($type) && $type == 'global'){
            return Topic::find()
                    ->where(['like','title',$_search])
                    ->andWhere(['not in','city_id',$except])
                    ->orderBy(['brilliant_count'=> SORT_DESC])
                    ->limit($limit)
                    ->all();
        }else{
            return Topic::find()
                        ->where(['like','title',$_search])
                        ->orderBy(['brilliant_count'=> SORT_DESC])
                        ->all();
        }
    }

    // Get top $limit topic in City
    public function GetTopTopic($city,$limit){
        return Topic::find()
                    ->joinWith('city')
                    ->where(['city.id' => $city])
                    ->andWhere(['not',['topic.status'=> '-1']])
                    ->orderBy(['topic.post_count'=> SORT_DESC])
                    ->limit($limit)
                    ->all();
    }

    //Get top topic in all netwrk
    public function GetTopTopicGlobal($limit, $city, $city_ids = null){
        if ($city != null) {
            $model = Topic::find()
                    ->where('city_id ='.$city)
                    ->andWhere(['not',['topic.status'=> '-1']])
                    ->orderBy(['topic.post_count'=> SORT_DESC])
                    ->limit($limit)
                    ->all();
        } else {
            // If state is not null then get top topic within that state
            if($city_ids != null) {
                $model = Topic::find()
                    ->joinWith('city')
                    ->where('city.id IN ('.$city_ids.')')
                    ->andWhere(['not',['topic.status'=> '-1']])
                    ->orderBy(['topic.post_count'=> SORT_DESC])
                    ->limit($limit)
                    ->all();
            } else {
                $model = Topic::find()
                    ->where(['not',['topic.status'=> '-1']])
                    ->orderBy(['topic.post_count'=> SORT_DESC])
                    ->limit($limit)
                    ->all();
            }
        }

        $topics = [];
        foreach ($model as $key => $value) {
            # code...
            if (empty($value->city)) continue;
            $item = [
                'id' => $value->id,
                'name'=> $value->title,
                'post_count'=> $value->post_count,
                'city_id'=> $value->city_id,
                'city_name'=> $value->city->name
            ];
            array_push($topics, $item);
        }

        return $topics;
    }
}

<?php

namespace frontend\modules\netwrk\models;

use Yii;

/**
 * This is the model class for table "history_feed".
 *
 * @property integer $id
 * @property integer $id_item
 * @property string $type_item
 * @property string $created_at
 */
class HistoryFeed extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'history_feed';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id_item'], 'integer'],
            [['created_at'], 'required'],
            [['created_at'], 'safe'],
            [['type_item'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'id_item' => 'Id Item',
            'type_item' => 'Type Item',
            'created_at' => 'Created At',
        ];
    }
}
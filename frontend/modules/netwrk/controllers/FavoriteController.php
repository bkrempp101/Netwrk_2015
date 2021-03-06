<?php

namespace frontend\modules\netwrk\controllers;

use frontend\components\UtilitiesFunc;
use frontend\components\BaseController;
use frontend\modules\netwrk\models\City;
use frontend\modules\netwrk\models\User;
use frontend\modules\netwrk\models\Favorite;
use yii\helpers\Url;
use yii\db\Query;
use yii\data\Pagination;
use yii\web\Cookie;
use Yii;

class FavoriteController extends BaseController
{

    public function actionFavorite()
    {
        $returnData = array();
        //Get params
        $object_type = isset($_GET['object_type']) ? $_GET['object_type'] : '';
        $currentUser = isset($_GET['user_id']) ? $_GET['user_id'] : Yii::$app->user->id;

        //if object_type is city then find does currentUser already favorited city previously.
        if ($object_type == 'city') {
            $object_id = isset($_GET['object_id']) ? $_GET['object_id'] : '';
            $favorite = Favorite::find()->where('user_id = '.$currentUser.' AND city_id = '.$object_id)->one();
        }

        //If user already favorite/Unfavorite the object then UPDATE existing record else INSERT new record.
        if ($favorite) {
            $favorite->updated_at = date('Y-m-d H:i:s');
            if ($favorite->status == 1) {
                $favorite->status = 0;
                $favorite->save();
                $returnData['status'] = 'Follow';
            } else {
                $favorite->status = 1;
                $favorite->save();
                $returnData['status'] = 'Followed';
            }
        } else {
            $favorite = new Favorite;
            $favorite->user_id = $currentUser;
            if ($object_type == 'city') {
                $favorite->city_id = $object_id;
            }
            $favorite->type = $object_type;
            $favorite->status = 1;
            $favorite->created_at = date('Y-m-d H:i:s');
            $favorite->save();
            $returnData['status'] = 'Followed';
        }

        if ($favorite) {
            $data = [
                'id' => $favorite->id,
                'user_id' => $favorite->user_id,
                'city_id' => $favorite->city_id,
                'type' => $favorite->type,
                'status' => $favorite->status,
                'created_at' => $favorite->created_at,
                'updated_at' => $favorite->updated_at
            ];
        }

        $returnData['success'] = 'true';
        $returnData['data'] = $data;
        $hash = json_encode($returnData);

        return $hash;
    }

    /**
     * Do the favorite users own home zipcode city
     * @return string
     */
    public function actionFavoriteHomeZipcode()
    {
        $returnData = array();
        //Get params
        $object_type = 'city';
        $currentUser = isset($_GET['user_id']) ? $_GET['user_id'] : Yii::$app->user->id;

        $user = User::find()->where(['id' => $currentUser])->with('profile')->one();
        $zipcode = $user->profile->zip_code;

        if(isset($zipcode)) {
            $city = City::find()->select('city.*')
                    ->where(['zip_code' => $zipcode])
                    ->andWhere('office_type is null')
                    ->one();
            if($city) {
                //if object_type is city then find does currentUser already favorited city previously.
                $object_id = $city->id;
                $favorite = Favorite::find()->where('user_id = '.$currentUser.' AND city_id = '.$object_id)->one();

                //If user already favorited the object then UPDATE existing record else INSERT new record.
                if ($favorite) {
                    $favorite->updated_at = date('Y-m-d H:i:s');
                    $favorite->status = 1;
                    $favorite->save();
                } else {
                    $favorite = new Favorite;
                    $favorite->user_id = $currentUser;
                    if ($object_type == 'city') {
                        $favorite->city_id = $object_id;
                    }
                    $favorite->type = $object_type;
                    $favorite->status = 1;
                    $favorite->created_at = date('Y-m-d H:i:s');
                    $favorite->save();
                }

                if ($favorite) {
                    $data = [
                        'id' => $favorite->id,
                        'user_id' => $favorite->user_id,
                        'city_id' => $favorite->city_id,
                        'type' => $favorite->type,
                        'status' => $favorite->status,
                        'created_at' => $favorite->created_at,
                        'updated_at' => $favorite->updated_at
                    ];
                }

                $returnData['success'] = 'true';
                $returnData['data'] = $data;
            } else {
                $returnData['error'] = 'true';
                $returnData['message'] = 'City not found of zipcode  '.$zipcode;
            }
        } else {
            $returnData['error'] = 'true';
            $returnData['message'] = 'Profile do not have any home zipcode. Profile zipcode field is blank.';
        }

        $hash = json_encode($returnData);
        return $hash;
    }

    public function actionGetFavoriteCommunitiesByUser()
    {
        $returnData = array();
        $communities = Favorite::getFavoriteCommunitiesByUser(Yii::$app->user->id);

        $data = [];
        foreach ($communities as $key => $value) {

            $item = array(
                'city_id'=> $value['city_id'],
                'city_zipcode'=>$value['zip_code'],
                'city_name'=>$value['name'],
                'city_office'=>$value['office'],
                'city_office_type'=>$value['office_type'],
                'user_id' => $value['user_id'],
                'status' => $value['status'],
                'lat' => $value['lat'],
                'lng' => $value['lng']
            );
            array_push($data,$item);

        }
        $returnData['data'] = $data;
        $hash = json_encode($returnData);
        return $hash;
    }

    public function actionGetJoinedCommunitiesByUser()
    {
        $cookies = Yii::$app->request->cookies;
        //if selectedZip not set then use cover page zip to fetch feeds
        $zip_code = ($cookies->getValue('nw_selectedZip')) ? $cookies->getValue('nw_selectedZip') : $cookies->getValue('nw_zipCode');

        $returnData = array();
        $communities = Favorite::getFavoriteCommunitiesByUser(Yii::$app->user->id);


        $city = [];
        foreach($communities as $key => $value){
            $city[$value->zip_code][] = $value;
        }

        $data = [];
        foreach ($communities as $key => $value) {

            $item = array(
                'city_id'=> $value['city_id'],
                'city_zipcode'=>$value['zip_code'],
                'city_name'=>$value['name'],
                'city_office'=>$value['office'],
                'city_office_type'=>$value['office_type'],
                'user_id' => $value['user_id'],
                'status' => $value['status'],
                'lat' => $value['lat'],
                'lng' => $value['lng'],
                'selected_zipcode' => $zip_code
            );
            array_push($data,$item);

        }

        $groupArray = array();
        foreach ($data as $item) {
            $groupArray[$item['city_name']][] = $item;
        }

        $returnData['data'] = $groupArray;
        $hash = json_encode($returnData);
        return $hash;
    }
}
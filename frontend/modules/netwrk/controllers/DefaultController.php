<?php

namespace frontend\modules\netwrk\controllers;

use Yii;
use yii\web\Session;
use yii\db\Query;
use yii\helpers\Url;
use frontend\components\BaseController;
use frontend\modules\netwrk\models\Topic;
use frontend\modules\netwrk\models\City;
use frontend\modules\netwrk\models\Post;
use frontend\modules\netwrk\models\User;
use frontend\modules\netwrk\models\WsMessages;
use frontend\modules\netwrk\models\Temp;
use frontend\components\UtilitiesFunc;

class DefaultController extends BaseController
{

    public function actionIndex()
    {
        return $this->render($this->getIsMobile() ? 'mobile/index' : 'index');
    }

    public function actionGetUserProfile()
    {
        if (Yii::$app->user->id) {
            $user = User::find()->where('id ='.Yii::$app->user->id)->with('profile')->one();
        }

        if ($user->profile->photo == null){
            $image = 'img/icon/no_avatar.jpg';
        }else{
            $image = 'uploads/'.$user->id.'/'.$user->profile->photo;
        }

        $data = [
                'user_id'=> $user->id,
                'name'=> $user->profile->first_name." ".$user->profile->last_name,
                'avatar'=> $image,
                'created_date' => $user->create_time
            ];
        $data = json_encode($data);
        return $data;
    }

    public function actionGetUserPosition()
    {

        $user = User::find()->where('id ='.Yii::$app->user->id)->with('profile')->one();
        $data =[
            'lat'=> $user->profile->lat,
            'lng'=> $user->profile->lng,
        ];

        $hash = json_encode($data);
        return $hash;
    }

    public function actionCheckExistZipcode()
    {
        $zipcode = $_POST['zipcode'];
        $city = City::find()->where(['zip_code'=>$zipcode])->one();

        if($city){
            $data = ['status'=> 1,'city'=>$city->id];
        }else{
            $data = ['status'=> 0];
        }
        $hash = json_encode($data);
        return $hash;
    }

    public function actionCheckExistPlaceZipcode()
    {
        $zipcode = $_POST['zipcode'];
        $place_name = $_POST['place_name'];
        $type = $_POST['type'];
        if($type == 'gov'){
            $city = City::find()->where(['zip_code'=>$zipcode, 'office_type'=>'government'])->one();
        }else{
            $city = City::find()->where(['zip_code'=>$zipcode, 'office_type'=>'university'])->one();
        }

        if($city){
            $data = ['status'=> 1,'city'=>$city->id];
        }else{
            $cty = City::find()->where(['zip_code'=>$zipcode])->one();
            $data = ['status'=> 0, 'city_name'=>$cty->name];
        }
        $hash = json_encode($data);
        return $hash;
    }

    // Get 4 topic have post most
    protected static function Top4Topices($city)
    {

        $topices = Topic::Get4Topic($city);
        $data =[];
        foreach ($topices as $key => $value){
            $item =[
                'id'=> $value->id,
                'name'=> $value->title,
                'city'=> $value->city->id,
                'city_name'=>$value->city->zip_code,
                'num_post'=> $value->post_count
            ];

            array_push($data, $item);
        }

        return $data;
    }

    //Get Similarpost and trending number on top 4 post
    protected function Trending4Post($city)
    {
        $hashtag = [];
        foreach ($city->topics as $topic){
            foreach ($topic->posts as $post) {
                # code...
                $arr = explode(' ',trim($post->title));
                $item = [
                    'post_id'=> $post->id,
                    'post_name'=> $arr[0],
                    'post_trending'=> Post::SearchHashTagPost($arr[0],$city->id),
                    'user_join'=>Post::CountUserJoinPost($post->id)
                ];
                array_push($hashtag, $item);
            }
        }
        $data = $this->GetTop4Trending($hashtag);

        return $data;
    }

    //Sort 4 post have trending most
    protected static function GetTop4Trending($hashtag)
    {
        $sortArray = [];

        foreach($hashtag as $person){
            foreach($person as $key=>$value){
                if(!isset($sortArray[$key])){
                    $sortArray[$key] = [];
                }
                $sortArray[$key][] = $value;
            }
        }

        $orderby = "user_join";
        array_multisort($sortArray[$orderby],SORT_DESC,$hashtag);

        return array_slice($hashtag, 0, 4);
    }

    protected static function GetPostMostBrilliant($city)
    {
        $post = Post::GetPostMostBrilliant($city);
        $item = [
                    'post_id'=>$post->id,
                    'brilliant'=>$post->brilliant_count ? $post->brilliant_count : 0,
                    'name_post'=> $post->title,
                    'content' => $post->content,
                    'post_type'=> $post->post_type,
                    'topic_id' => $post->topic_id,
                    'user'=> $post->user
                ];

        return $item;
    }

    public function actionGetMakerDefaultZoom()
    {
        $maxlength = Yii::$app->params['MaxlengthContent'];

        $query = new Query();
        $datas = $query->select('COUNT(DISTINCT ws_messages.user_id) AS count_user_comment, city.id, COUNT(post.id) AS post_count')
            ->from('city')
            ->leftJoin('topic', 'city.id=topic.city_id')
            ->leftJoin('post', 'topic.id=post.topic_id')
            ->leftJoin('ws_messages', 'post.id=ws_messages.post_id')
            ->groupBy('city.id')
            ->orderBy('count_user_comment DESC, post_count DESC')
            ->limit(10)
            ->all();
        $zipcodes = array();
        for ($i=0; $i < count($datas); $i++) {
            array_push($zipcodes, $datas[$i]['id']);
        }
        // $cities = City::find()->with('topics.posts')->orderBy(['user_count'=> SORT_DESC,'post_count'=> SORT_DESC])->limit(10)->all();
        $cities = City::find()->with('topics.posts')->where(['id' => $zipcodes])->all();
        // echo '<pre>';var_dump($cities);die;

        $data = [];
        // SELECT COUNT(DISTINCT a.user_id) AS count_user_comment FROM `ws_messages` AS a WHERE post_id = 247;
        // or
        // SELECT COUNT(DISTINCT a.user_id) AS count_user_comment, c.post_id  FROM `ws_messages` as a, post as b, topic as
        // c, city as d WHERE a.post_id=b.id AND b.topic_id=c.id AND c.city_id=d.id GROUP BY a.post_id ORDER BY count_user_comment
        //  DESC LIMIT 10;

        foreach ($cities as $key => $value) {
            if(isset($value->topics[0])) {
                $post = $this->GetPostMostBrilliant($value->id);
                $user_post = $post['user'];
                $content = $post['content'];
                $topices = $this->Top4Topices($value->id);
                $trending = $this->Trending4Post($value);

                // if(strlen($content) > $maxlength ){
                //     $content = substr($post->content,0,$maxlength) ;
                //     $content = $content."...";
                // }

                $netwrk = array(
                    'id'=> $value->id,
                    'name'=> ($value->office != '') ? $value->office : $value->name,
                    'lat'=> $value->lat,
                    'lng'=>$value->lng,
                    'zip_code'=> $value->zip_code,
                    'office'=>$value->office,
                    'office_type'=>$value->office_type,
                    'topic'=> $topices,
                    'trending_post'=> $trending,
                    'user'=>[
                        'username'  => $user_post->profile->first_name." ".$user_post->profile->last_name,
                        'avatar'    => $user_post->profile->photo ? Url::to('@web/uploads/'.$user_post->id.'/'.$user_post->profile->photo) : Url::to('@web/img/icon/no_avatar.jpg'),
                        'work'      => $user_post->profile->work,
                        'zipcode'   => $user_post->profile->zip_code,
                        'place'     => $user_post->profile->city ? $user_post->profile->city->name : ''
                    ],
                    'post'=>$post
                );
                array_push($data,$netwrk);
            } else {
                $netwrk = array(
                    'id'=> $value->id,
                    'name'=> $value->name,
                    'lat'=> $value->lat,
                    'lng'=>$value->lng,
                    'zip_code'=> $value->zip_code,
                    'office'=>$value->office,
                    'office_type'=>$value->office_type,
                    'topic' => '',
                    'post'=> array(
                        'post_id'=>-1,
                        'name_post'=> '',
                        'content' => '',
                        'topic_id' => '',
                    )
                );

                array_push($data,$netwrk);
            }
        }

        $hash = json_encode($data);
        return $hash;
    }

    public function actionGetMakerMaxZoom()
    {
        $maxlength = Yii::$app->params['MaxlengthContent'];
        $cities = City::find()->with('topics.posts')->orderBy(['post_count'=> SORT_DESC])->all();

        $data = [];

        foreach ($cities as $key => $value) {
            if(isset($value->topics[0])) {
				$post = $this->GetPostMostBrilliant($value->id);
                $user_post = $post['user'];
                $content = $post['content'];
                $topices = $this->Top4Topices($value->id);
                $trending = $this->Trending4Post($value);

                // if(strlen($content) > $maxlength ){
                //     $content = substr($post->content,0,$maxlength ) ;
                //     $content = $content."...";
                // }

                $netwrk = array(
                    'id'=> $value->id,
                    'name'=> $value->name,
                    'lat'=> $value->lat,
                    'lng'=>$value->lng,
                    'zip_code'=> $value->zip_code,
                    'office'=>$value->office,
                    'office_type'=>$value->office_type,
                    'topic'=> $topices,
                    'trending_post'=> $trending,
                    'user'=>[
                        'username'  => $user_post->profile->first_name." ".$user_post->profile->last_name,
                        'avatar'    => $user_post->profile->photo ? Url::to('@web/uploads/'.$user_post->id.'/'.$user_post->profile->photo) : Url::to('@web/img/icon/no_avatar.jpg'),
                        'work'      => $user_post->profile->work,
                        'zipcode'   => $user_post->profile->zip_code,
                        'place'     => $user_post->profile->city->name
                    ],
                    'post'=>$post
                );
                array_push($data,$netwrk);
            } else {
                $netwrk = array(
                    'id'=> $value->id,
                    'name'=> $value->name,
                    'lat'=> $value->lat,
                    'lng'=>$value->lng,
                    'zip_code'=> $value->zip_code,
                    'office'=>$value->office,
                    'office_type'=>$value->office_type,
                    'topic' => '',
                    'post'=> array(
                        'post_id'=>-1,
                        'name_post'=> '',
                        'content' => '',
                        'topic_id' => '',
                    )
                );

                array_push($data,$netwrk);
            }
        }

        $hash = json_encode($data);
        return $hash;
    }

    public function actionGetMarkerUpdate()
    {
        $maxlength = Yii::$app->params['MaxlengthContent'];
        $city_id = $_POST['city'];
        $city= City::find()->with('topics.posts')->where(['id'=>$city_id])->one();

        $data = [];

        if($city){
            if(isset($city->topics[0])) {
                $post = $city->topics[0]->posts[0];
                $content = $post->content;
                $user_post = $post->user;
                $content = $post->content;
                $topices = $this->Top4Topices($city->id);
                $trending = $this->Trending4Post($city);

                if(strlen($content) > $maxlength ){
                    $content = substr($post->content,0,$maxlength ) ;
                    $content = $content."...";
                }

                $netwrk = array(
                    'id'=> $city->id,
                    'name'=> $city->name,
                    'lat'=> $city->lat,
                    'lng'=>$city->lng,
                    'zip_code'=> $city->zip_code,
                    'office'=>$city->office,
                    'office_type'=>$city->office_type,
                    'topic'=> $topices,
                    'trending_post'=> $trending,
                    'user'=>[
                        'username'  => $user_post->profile->first_name." ".$user_post->profile->last_name,
                        'avatar'    => $user_post->profile->photo ? Url::to('@web/uploads/'.$user_post->id.'/'.$user_post->profile->photo) : Url::to('@web/img/icon/no_avatar.jpg'),
                        'work'      => $user_post->profile->work,
                        'zipcode'   => $user_post->profile->zip_code,
                        'place'     => $user_post->profile->city->name
                    ],
                    'post'=>[
                        'post_id'=>$post->id,
                        'brilliant'=>$post->brilliant_count ? $post->brilliant_count : 0,
                        'name_post'=> $post->title,
                        'content' => $content,
                        'topic_id' => $post->topic_id,
                    ]
                );
            } else {
                $netwrk = array(
                    'id'=> $city->id,
                    'name'=> $city->name,
                    'lat'=> $city->lat,
                    'lng'=>$city->lng,
                    'zip_code'=> $city->zip_code,
                    'office'=>$city->office,
                    'office_type'=>$city->office_type,
                    'topic' => '',
                    'post'=> array(
                        'post_id'=>-1,
                        'name_post'=> '',
                        'content' => '',
                        'topic_id' => '',
                    )
                );
            }
        }

        $hash = json_encode($netwrk);
        return $hash;
    }

    public function actionPlaceSave(){
        $zipcode = $_POST['zip_code'];
        $city_name = $_POST['netwrk_name'];
        $lat = $_POST['lat'];
        $lng = $_POST['lng'];
        $office = $_POST['office'];
        $office_type = $_POST['office_type'];

        $netwrk = new City;
        $netwrk->name = $city_name;
        $netwrk->lat = $lat;
        $netwrk->lng = $lng;
        $netwrk->zip_code = $zipcode;
        $netwrk->office = $office;
        $netwrk->office_type = $office_type;
        $netwrk->save();
        return json_encode($netwrk->id);
    }

    public function actionInsertLocalUniversity(){
        $zcodes = City::find()->select(['id', 'zip_code'])->where(['office_type'=>'university'])->all();
        $datas = City::find()->select(['id', 'zip_code'])->where('office is null')->all();
        $arrs = [];
        for ($i=0; $i < count($zcodes); $i++) { 
            array_push($arrs, $zcodes[$i]->zip_code);
        }

        $arrs2 = [];
        for ($i=0; $i < count($datas); $i++) { 
            array_push($arrs2, $datas[$i]->zip_code);
        }

        for ($i=0; $i < count($arrs); $i++) {
            if(($key = array_search($arrs[$i], $arrs2)) !== false){
                unset($arrs2[$key]);
            }
        }

        $ctys = City::find()->where(['zip_code'=>$arrs2])->andWhere('office_type is null')->all();

        for ($i=0; $i < count($ctys); $i++) {
            $lat = $ctys[$i]->lat + 0.02;
            $lng = $ctys[$i]->lng + 0.02;

            $temp = Temp::find()->where(['zipcode' => $ctys[$i]->zip_code])->one();

            if($lat >= $temp->lat_max)
                $lat = $temp->lat_max - 0.005;
            if($lng >= $temp->lng_max)
                $lng = $temp->lng_max - 0.005;

            $city = new City();
            $city->name = $ctys[$i]->name;
            $city->lat = $lat;
            $city->lng = $lng;
            $city->zip_code = $ctys[$i]->zip_code;
            $city->office = 'Local University';
            $city->office_type = 'university';
            $city->save();
        }
    }

    public function actionInsertLocalGovernment(){
        $zcodes = City::find()->select(['id', 'zip_code'])->where(['office_type'=>'government'])->all();
        $datas = City::find()->select(['id', 'zip_code'])->where('office is null')->all();
        $arrs = [];
        for ($i=0; $i < count($zcodes); $i++) { 
            array_push($arrs, $zcodes[$i]->zip_code);
        }

        $arrs2 = [];
        for ($i=0; $i < count($datas); $i++) { 
            array_push($arrs2, $datas[$i]->zip_code);
        }

        for ($i=0; $i < count($arrs); $i++) {
            if(($key = array_search($arrs[$i], $arrs2)) !== false){
                unset($arrs2[$key]);
            }
        }

        $ctys = City::find()->where(['zip_code'=>$arrs2])->andWhere('office_type is null')->all();

        for ($i=0; $i < count($ctys); $i++) { 
            $lat = $ctys[$i]->lat - 0.02;
            $lng = $ctys[$i]->lng + 0.02;

            $temp = Temp::find()->where(['zipcode' => $ctys[$i]->zip_code])->one();

            if($lat <= $temp->lat_min)
                $lat = $temp->lat_min + 0.005;
            if($lng >= $temp->lng_max)
                $lng = $temp->lng_max - 0.005;
            $city = new City();
            $city->name = $ctys[$i]->name;
            $city->lat = $lat;
            $city->lng = $lng;
            $city->zip_code = $ctys[$i]->zip_code;
            $city->office = 'Local Government Office';
            $city->office_type = 'government';
            $city->save();
        }
    }
}

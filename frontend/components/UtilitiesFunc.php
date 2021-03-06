<?php
namespace frontend\components;
use Yii;
class UtilitiesFunc
{
	public static function CalculatorDistance($lat1, $lon1, $lat2, $lon2){
        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;

        return $miles;
	}

	public static function GetUserCurrent(){
		$currentUser = 0;
		if(!Yii::$app->user->isGuest){
			$currentUser = Yii::$app->user->id;
		}
		return $currentUser;
	}

	public static function changeFormatNumber($num)
	{
		$fnum = $num;
		if($fnum >=1000 && $fnum < 99999 ){
			$fnum = intval($fnum/1000);
			$fnum = "{$fnum}K";
		}elseif($fnum >= 100000 && $fnum < 999999){
			$fnum = round(floatval($fnum/1000000),1);
			$fnum = "{$fnum}M";
		}elseif($fnum >= 1000000){
			$fnum = round(floatval($fnum/10000000),1);
			$fnum = "{$fnum}G";
		}
		return $fnum;
	}

	public static function getDateTime($date)
	{
		$current_date = date('Y-m-d H:i:s');

		// for test
		// $date1 = strtotime('2014-5-30 15:30:00');
		// $date2 = strtotime('2014-5-30 15:30:29');
		// $time1 = date_create('2014-5-30 15:30:00');
		// $time2 = date_create('2014-5-30 15:30:29');

		$date1 = strtotime($date);
		$date2 = strtotime($current_date);
		$time1 = date_create($date);
		$time2 = date_create($current_date);

		$diff = $date2 - $date1;
		$diff_days = floor($diff/(60*60*24));


		$dsecond = $time1->diff($time2)->s;
		$dminutes = $time1->diff($time2)->i;
		$dhours = $time1->diff($time2)->h;


		$time = array(
		  'total_days' => $diff_days,
		  'hours' => $dhours,
		  'minutes' => $dminutes,
		  'second' => $dsecond
		);

		return $time;
	}

	public static function FormatTimeChat($date){
		$current_date = date('Y-m-d');
		$timestampformat = date_format(date_create($date),'Y-m-d');
		$date1 = date_create($timestampformat);
		$date2 = date_create($current_date);

		$diff=$date2->diff($date1)->d;

		if(intval($diff) >= 1){
			$time = date_format(date_create($date),'m/d/Y');
		}else{
			$time = date('h:i A',strtotime($date));
		}

		return $time;
	}

	public static function FormatDateTime($date){
		$diff = self::GetDateTime($date);

		$ddays = $diff['total_days'];
		$mweek = $diff['total_days'] % 7;
		$dweek = intval($diff['total_days'] / 7);

		$mmonth = $diff['total_days'] % 30;
		$dmonth = intval($diff['total_days'] / 30);

		$myear = $diff['total_days'] % 365;
		$dyear = intval($diff['total_days'] / 365);

		if($ddays == 0){
		  if ($diff['hours'] == 0){
		    if($diff['minutes'] == 0){
		      if($diff['second'] == 0 || $diff['second'] < 60 )
		        $count_time = "Now";
		    }else{
		      $count_time = "{$diff['minutes']} min";
		    }
		  }elseif ($diff['hours'] == 1){
		    $count_time = "{$diff['hours']} hr";
		  }else{
		    $count_time = "{$diff['hours']} hrs";
		  }
		}elseif($ddays <= 99){
			$marray = array($mweek,$mmonth);
			$darray = array($dweek,$dmonth);
			if($ddays == 1){
				$count_time = "{$ddays} day";
			}elseif($mweek < $mmonth && $mweek == 0 && $dweek == 1 ){
				$count_time = "{$dweek} wk";
			}elseif($mweek < $mmonth && $mweek == 0 && $dweek != 1){
				$count_time = "{$dweek} wks";
			}elseif($mweek > $mmonth && $mmonth == 0 && $dmonth == 1){
				$count_time = "{$dmonth} mo";
			}elseif($mweek > $mmonth && $mmonth == 0 && $dmonth != 1){
				$count_time = "{$dmonth} mos";
			}else{
				$count_time = "{$ddays} days";
			}
		}elseif($ddays == 365){
			$count_time = "{$dyear} yr";
		}elseif($ddays > 100 && $ddays < 730){
			if($mweek < $mmonth && $mweek < $myear ){
				$count_time = "{$dweek} wks";
			}elseif($mweek > $mmonth && $mmonth < $myear){
				$count_time = "{$dmonth} mos";
			}elseif($mweek > $myear && $mmonth > $myear){
				$count_time = "{$dyear} yrs";
			}
		}elseif ($ddays >= 730 && $ddays < 2000) {
			if($myear > $mmonth){
				$count_time = "{$dmonth} mos";
			}else{
				$count_time = "{$dyear} yrs";
			}
		}else{
			$count_time = "{$dyear} yrs";
		}

		return $count_time;
	}

	public static function FormatTwitterStyleDateTime($date){
		$diff = self::GetDateTime($date);

		$ddays = $diff['total_days'];
		$mweek = $diff['total_days'] % 7;
		$dweek = intval($diff['total_days'] / 7);

		$mmonth = $diff['total_days'] % 30;
		$dmonth = intval($diff['total_days'] / 30);

		$myear = $diff['total_days'] % 365;
		$dyear = intval($diff['total_days'] / 365);

		if($ddays == 0){
			if ($diff['hours'] == 0){
				if($diff['minutes'] == 0){
					if($diff['second'] == 0 || $diff['second'] < 60 )
						$count_time = "Now";
				}else{
					$count_time = "{$diff['minutes']}min";
				}
			}elseif ($diff['hours'] == 1){
				$count_time = "{$diff['hours']}h";
			}else{
				$count_time = "{$diff['hours']}h";
			}
		}elseif($ddays <= 99){
			$marray = array($mweek,$mmonth);
			$darray = array($dweek,$dmonth);
			if($ddays == 1){
				$count_time = "{$ddays}d";
			}elseif($mweek < $mmonth && $mweek == 0 && $dweek == 1 ){
				$count_time = "{$dweek}wk";
			}elseif($mweek < $mmonth && $mweek == 0 && $dweek != 1){
				$count_time = "{$dweek}wks";
			}elseif($mweek > $mmonth && $mmonth == 0 && $dmonth == 1){
				$count_time = "{$dmonth}m";
			}elseif($mweek > $mmonth && $mmonth == 0 && $dmonth != 1){
				$count_time = "{$dmonth}m";
			}else{
				$count_time = "{$ddays}d";
			}
		}elseif($ddays == 365){
			$count_time = "{$dyear}yr";
		}elseif($ddays > 100 && $ddays < 730){
			if($mweek < $mmonth && $mweek < $myear ){
				$count_time = "{$dweek}wks";
			}elseif($mweek > $mmonth && $mmonth < $myear){
				$count_time = "{$dmonth}mos";
			}elseif($mweek > $myear && $mmonth > $myear){
				$count_time = "{$dyear}yrs";
			}
		}elseif ($ddays >= 730 && $ddays < 2000) {
			if($myear > $mmonth){
				$count_time = "{$dmonth}mos";
			}else{
				$count_time = "{$dyear}yrs";
			}
		}else{
			$count_time = "{$dyear}yrs";
		}

		return $count_time;
	}
}
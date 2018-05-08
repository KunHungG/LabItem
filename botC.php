<?php
/*###############################################################################
將該PHP網頁上傳到有SSL憑證的Server上，再到https://developers.line.me將你的Line
bot的Webhook URL改成這個PHP的網址位置(記得要先Enabled Use webhooks)。
################################################################################*/


//單引號中輸入你的LINE bot的Channel access token(很長很長非常長的那段).
$access_token ='S7b/h+/vo3lZm15c8Lr//HAbj05jcWXLCD+sSi1wALDCEQzzyeo5oxK3ZZ6Ze7xjrS/6gjwIowxI8cxL/tWn3i9znf+p8YdVnXs3WkCij41IZ0+1NTSZm0RnzsV7hiEayvr7feFqGW8re8FmhukCdAdB04t89/1O/w1cDnyilFU=';


/*#############################Annotation#########################################
							Function name->Push function
以下程式是在你透過網路GET的方式傳送你要傳送的訊息及目的地時用的。
用法：
【http://你的伺服器位置/botC?userid=要傳送的UserID(非LineID)&message=要傳送的訊息】
輸入以上網址就可以將訊息傳到某用戶上。
#############################Annotation end.####################################*/
if( isset($_GET['userid']) && isset($_GET['message'])){
$push_data = [
  "to" => $_GET['userid'],
  "messages" => [
	[
      "type" => "text",
      "text" => $_GET['message']
    ]
  ]
]; 
$ch = curl_init("https://api.line.me/v2/bot/message/push");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($push_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Authorization: Bearer '.$access_token
));
$result = curl_exec($ch);
fwrite($file, $result."\n");  
fclose($file);
curl_close($ch);
}
//###########################Push function end.#######################################




/*#############################Annotation#########################################
							Function name->Reply function
以下程式是在你的LINE bot收到訊息時，LINE Server會將LINE bot收到的訊息Post到該掛接
的網頁，該網頁就可以將收到訊息進行處理，並可回傳一些處理解果，例如:輸入"ID"，LINE
bot 就會回傳你的UserID給你。
#############################Annotation end.####################################*/
$json_string = file_get_contents('php://input'); 
$json_obj = json_decode($json_string);

$event = $json_obj->{"events"}[0];
$userID = $event->{"source"}->{"userId"};
$type  = $event->{"message"}->{"type"};
$message = $event->{"message"};
$reply_token = $event->{"replyToken"};
$stuednt_array=explode(" ",$message->{"text"});

if($stuednt_array[0]=='ID'){

$post_data = [
  "replyToken" => $reply_token,
  "messages" => [
    [
      "type" => "text",
      "text" => "你的UserID：".$userID
    ]
  ]
]; 
}
$ch = curl_init("https://api.line.me/v2/bot/message/reply");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Authorization: Bearer '.$access_token
));
$result = curl_exec($ch);
fwrite($file, $result."\n");  
fclose($file);
curl_close($ch);
//###########################Reply function end.#######################################
?>
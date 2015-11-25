<?php use yii\helpers\Url; ?>
<div class="modal" id='modal_chat_post'>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<div class="header">
					<div class="back_page">
						<span><i class="fa fa-arrow-circle-left"></i> Back </span>
					</div>
					<div class="title_page">
						<span class="title">
							
						</span>
					</div>
				</div>
			</div>
			<div class="modal-body">
				<div class="container_post_chat"></div>
			</div>
			<div class="modal-footer">
				<div class="send_message input-group">
					<textarea type="text" class="form-control" placeholder="Type message here..." maxlength="1024"></textarea>
					<div class="input-group-addon paper"><i class="fa fa-paperclip"></i></div>
					<div class="input-group-addon emoji"><i class="fa fa-smile-o"></i></div>
					<div class="input-group-addon send" id="sizing-addon2">Send</div>
				</div>
			</div>
		</div>
	</div>
	<script id="chatpost_name" type="text/x-underscore-template">
		<span><a href="<?= Url::base(true); ?>"><img src="<?= Url::to('@web/img/icon/netwrk-logo.png'); ?>"></a></span>
		<span><i class="fa fa-angle-right"></i><%= name.topic_name%></span>
		<span><i class="fa fa-angle-right"></i><%= name.post_name %></span>
	</script>
	<script id="message_chat" type="text/x-underscore-template">
		<% if (msg.user_current){ %>
		    <div class="message_send message" data-img="<?= Url::to('@web/img/icon/timehdpi.png'); ?>">
		<% }else{ %>
		    <div class="message_receiver message" data-img="<?#= Url::to('@web/img/icon/timehdpi.png'); ?>">
		<% } %>
	        <div class="user_thumbnail">
	            <div class="avatar">
	                <img src="<%= baseurl %><%=  msg.avatar %>">
	            </div>
	        </div>
	        <div class="content_message">
	            <p class="content"><%= msg.msg %></p>
	            <p class="time"><%= msg.created_at %></p>
	        </div>      
	    </div>
	</script>
</div>

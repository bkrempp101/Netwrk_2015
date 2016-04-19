<?php use yii\helpers\Url; ?>
<div class="modal" id='modal_landing_page'>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<div class="header">
					<a href="javascript:void(0)"><img src="<?= Url::to('@web/img/icon/netwrk-logo.png'); ?>"></a>
					<div class="title">
						<p class="main-header">Welcome, click explore to follow communities</p>
						<p class="sub-header">Here's what's happening in society today.</p>
					</div>
				</div>
			</div>
			<div class="modal-body">
				<div class="wrapper-container"></div>
			</div>
			<div class="modal-footer">
				<!--<div class="landing-btn btn-meet">Meet</div>-->
				<div class="landing-btn btn-explore">Explore</div>
				<div class="landing-btn btn-my-community">My Community</div>
				<div class="landing-btn btn-help">Help</div>
			</div>
		</div>
	</div>

</div>
<script id="landing_page" type="text/x-underscore-template">
	<div class="panel-group" id="accordion">
		<div class="panel panel-default top-post" id="panelTopPosts">
			<div class="panel-heading top-header">
				<a data-toggle="collapse" data-target="#collapseTopPosts"
				   href="javascript:" class="collapsed">
					<p class="lp-title">Top Posts</p>
					<p class="lp-description">Check out some of the discussions on some of your favorite subjects</p>
				</a>
			</div>
			<div id="collapseTopPosts" class="panel-collapse collapse">
				<div class="panel-body top-post-content">
					<%
						var len_post = landing.top_post.length;
						_.each(landing.top_post,function(e,i){
						if(i == len_post - 1){%>
							<div class="post-row last-row" data-value="<%= e.id %>" data-user="<%= e.user_id %>">
						<% }else{ %>
							<div class="post-row" data-value="<%= e.id %>" data-user="<%= e.user_id %>">
						<% } %>
								<div class="avatar"><div class="image"><img src="<%= e.photo %>"></div></div>

								<div class="post">
									<p class="post-title"><%= e.title %></p>
									<div class="post-content"><%= e.content%></div>
								</div>
								<div class="action">
									<div class="chat"><i class="fa fa-comments"></i>Chat</div>

									<span class="brilliant"><%= e.brilliant_count%></span>
								</div>
							</div>
						<%
						});
					%>
				</div>
			</div>
		</div>

		<div class="panel panel-default top-topic" id="panelTopTopics">
			<div class="panel-heading top-header">
				<a data-toggle="collapse" data-target="#collapseTopTopics"
				   href="javascript:" class="collapsed">
					<p class="lp-title">Top Topics</p>
					<p class="lp-description">Browse these topics of conversations</p>
				</a>
			</div>
			<div id="collapseTopTopics" class="panel-collapse collapse">
				<div class="panel-body top-topic-content">
					<%
						var len_topic = landing.top_post.length;
						_.each(landing.top_topic,function(e,i){
						if(i == len_topic - 1){ %>
							<div class="topic-row last-row" data-value="<%= e.id %>" data-city="<%= e.city_id %>" data-city-name="<%= e.city_name %>">
						<% }else{ %>
							<div class="topic-row" data-value="<%= e.id %>" data-city="<%= e.city_id %>" data-city-name="<%= e.city_name %>">
						<% } %>
								<p class="topic-title"><%= e.name %></p>
								<div class="post-counter">
									<%= e.post_count %>
									<span class="arrow"><i class="fa fa-angle-right"></i></span>
									<i class="fa fa-file-text"></i>
								</div>
							</div>
					<%
						});
					%>
				</div>
			</div>
		</div>

		<div class="panel panel-default top-communities" id="panelTopCommunities">
			<div class="panel-heading top-header">
				<a data-toggle="collapse" data-target="#collapseTopCommunities"
				   href="javascript:" class="collapsed">
					<p class="lp-title">Top Communities</p>
					<p class="lp-description">Browse these popular netwrks</p>
				</a>
			</div>
			<div id="collapseTopCommunities" class="panel-collapse collapse">
				<div class="panel-body top-communities-content">
					<%
						_.each(landing.top_communities,function(e,i){ %>
						<div class="communities-row" data-city="<%= e.city_id %>">
							<div class="com-content">
								<p class="zipcode" ><%= e.zip_code %> - <%= (e.office_name != null) ? e.office_name : e.city_name %></p>
								<p class="subtext">
									<% _.each(e.top_hashtag,function(d,s){ %>
									<span><%=d.hashtag %></span>
									<%})%>
								</p>
							</div>
							<span class="arrow"><i class="fa fa-angle-right"></i></span>
						</div>
					<%
						});
					%>
				</div>
			</div>
		</div>

		<% if(!_.isEmpty(landing.feeds)) {%>
			<div class="panel panel-default favorite-communities" id="panelFavoriteCommunities">
				<div class="panel-heading top-header">
					<a data-toggle="collapse" data-target="#collapseFavoriteCommunities"
					   href="javascript:">
						<p class="lp-title">Your Followed Areas</p>
					</a>
				</div>
				<div id="collapseFavoriteCommunities" class="panel-collapse collapse in">
					<div class="panel-body favorite-communities-content">

						<% if(!_.isEmpty(landing.feeds)) {%>
							<% _.each(landing.feeds, function(city_feed, key){ %>
								<!--<div class="community-title"><%= key %></div>-->
								<% _.each(city_feed, function(e, key){ %>

									<% if ((e.is_post == 1)){ %>
										<div class="feed-row feed-post" data-user="<%= e.user_id %>" data-value="<%= e.id %>" data-city="<%= e.city_id %>" data-topic='<%= e.topic_id %>'>
											<div class="avatar-poster"><div class="image"><img src="<%= e.photo %>"></div></div>
											<div class="feed-content">
												<div class='post'>
													<div class='post-title'><%= e.title %></div>
													<div class='post-content'><%= e.content %></div>
												</div>
												<span class='post-create-by'>Posted by: <%= e.posted_by %></span>
												<span class='appear-day'>
													<% if ((e.appear_day == 'Now')){ %>
													  Just Now
													<% }else{ %>
													  <%= e.appear_day %> ago
													<% } %>
												</span>
											</div>
										</div>
									<% }else{ %>
										<div class="feed-row feed-topic fav-community-topic" data-value="<%= e.id %>" data-city="<%= e.city_id %>" data-city-name='<%= e.city_name %>'>
											<div class="feed-content">
												<span class='topic-title'><%= e.title %></span>
												<span class='topic-create-by'>Topic created by: <%= e.created_by %></span>
												<span class='appear-day'>
													<% if ((e.appear_day == 'Now')){ %>
														Just Now
													<% }else{ %>
														<%= e.appear_day %> ago
													<% } %>
												</span>
											</div>
										</div>
									<% } %>
								<% }); %>
							<% }); %>
						<% } %>

					</div>
				</div>
			</div>
		<% } %>
	</div>
</script>

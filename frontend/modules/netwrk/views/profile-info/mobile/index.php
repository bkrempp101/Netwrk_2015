<section class="profile-page profile-info-page">
    <article class="header">
        <div class="back-page">
            <span><i class="fa fa-arrow-circle-left"></i> Back </span>
        </div>
        <div class="title-page">
            <span class="title">My Info</span>
        </div>
        <div class="edit-profile pull-right">
            <span><i class="fa fa-pencil"></i> Edit info </span>
        </div>
    </article>
    <article class="page-body info">
        <section class="heading-wrapper clearfix">
            <div class="heading pull-left text-center">Basic Info </div>
            <div class="separator-line pull-right">
                <hr>
            </div>
        </section>
        <div class="profile-basic-info clearfix">

        </div>

        <section class="heading-wrapper bio clearfix">
            <div class="heading pull-left text-center">Bio </div>
            <div class="separator-line pull-right">
                <hr>
            </div>
        </section>

        <div class="profile-bio">
        </div>
    </article>
</section>

<script id="profile_basic_info" type="text/x-underscore-template">
    <div class="basic-info-section">
        <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-text"><%= data.email %></div>
        </div>
        <div class="info-row">
            <div class="info-label">Home zip:</div>
            <div class="info-text"><%= data.zip %></div>
        </div>
        <div class="info-row">
            <div class="info-label">Marital status:</div>
            <div class="info-text"><%= data.marital_status %></div>
        </div>
        <div class="info-row">
            <div class="info-label">Education:</div>
            <div class="info-text"><%= data.education %></div>
        </div>

        <div class="info-row">
            <div class="info-label">Gender:</div>
            <div class="info-text"><%= data.gender %></div>
        </div>
        <div class="info-row">
            <div class="info-label">Date of birth:</div>
            <div class="info-text"><%= data.dob %></div>
        </div>
        <div class="info-row">
            <div class="info-label">Work:</div>
            <div class="info-text"><%= data.work %></div>
        </div>
        <div class="info-row">
            <div class="info-label">Hobbies:</div>
            <div class="info-text"><%= data.hobbies %></div>
        </div>
    </div>
</script>

<script id="profile_bio" type="text/x-underscore-template">
    <%= data.about %>
</script>


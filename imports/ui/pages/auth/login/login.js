import './login.html';

// Template Events
Template.Auth_login_page.events({
    'submit .login-form': function(event) {
        event.preventDefault();

        const target = event.target;

        var emailAddress = target.email.value;
        var password = target.password.value;

        Meteor.loginWithPassword(emailAddress, password, (error) => {
            if(error) {
                document.getElementById('error-msg').innerHTML = error.reason;
            } else {
                var user = Meteor.user();
                var deletedAt = user.profile.deletedAt;

                if(user.profile.type == "user" && (deletedAt == null || deletedAt == '')) {
                    FlowRouter.go('/');
                } else if(user.profile.type == "admin" && (deletedAt == null || deletedAt == '')) {
                    FlowRouter.go('/admin');
                } else {
                    document.getElementById('error-msg').innerHTML = "User not found";
                }
            }
        });
    },
});
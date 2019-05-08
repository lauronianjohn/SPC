// Custom Helpers

// Identifies the current route according to its name provided for
Template.registerHelper('currentRouteIs', function(route) { 
	return FlowRouter.current().route.name == route;
});
// Date Format
Template.registerHelper('formatDate', function(date) {
	return (date) ? moment(date).format('MMMM D, YYYY h:mm A') : moment().format('MMMM D, YYYY h:mm A');
});
// Capitalize the first letter of the word
Template.registerHelper('ucFirst', function(string) {
	return (string) ? string.charAt(0).toUpperCase() + string.slice(1) : "";
});
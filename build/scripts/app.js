$(function () {

	let header = Vue.component("site-header", {
		template: "<header class='header'>{{ message }}</header>",
		data: function () {
			message: "hello";
		}
	});

	let app = new Vue({
		el: "#app",
		data: {}
	});
});
//# sourceMappingURL=app.js.map

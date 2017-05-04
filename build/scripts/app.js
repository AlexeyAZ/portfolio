$(function () {

    Vue.component("site-nav", {
        props: ["list"],
        template: '#site-nav'
    });

    Vue.component("page-main", {
        props: ["list"],
        template: '#page-main'
    });

    Vue.component("page-gallery", {
        props: ["list"],
        template: '#page-gallery'
    });

    let app = new Vue({
        el: "#app",
        data: {
            parentMessage: "",
            location: {
                main: true,
                gallery: false
            },
            items: [{
                name: "Main",
                href: "http://",
                location: "main"
            }, {
                name: "Gallery",
                href: "http://",
                location: "gallery"
            }]
        },

        methods: {
            setLocation: function (item) {
                this.location[item.location] = true;
            }
        }
    });
});
//# sourceMappingURL=app.js.map

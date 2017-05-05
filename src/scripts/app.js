$(function() {

    Vue.component("site-nav", {
        props: ["list", "link"],
        template: '#site-nav',
        methods: {

            setLocation: function() {
                this.$emit("link_click", this.link.location);
            }
        }
    });

    Vue.component("page-main", {
        props: ["list"],
        template: '#page-main',
    });

    Vue.component("page-gallery", {
        props: ["list"],
        template: '#page-gallery',
    });

    var app = new Vue({
        el: "#app",
        data: {
            appLocation: "main",
            contentMove: true,
            links: [
                {
                    name: "Main",
                    href: "http://",
                    location: "main"
                },
                {
                    name: "Gallery",
                    href: "http://",
                    location: "gallery"
                }
            ],
            sites: [
                {
                    name: "site1",
                    href: "http://",
                    imgsrc: "img/img.jpg"
                }
            ]
        },

        methods: {

            renderLocation: function(location) {
                console.log(location)
                this.appLocation = location;
            },

            headerMouseover: function() {
                this.contentMove = !this.contentMove;
                console.log(this.contentMove)
            },

            headerMouseout: function() {
                this.contentMove = !this.contentMove;
                console.log(this.contentMove)
            }
        }
    })

});


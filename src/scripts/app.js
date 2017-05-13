$(function() {

    Vue.component("site-nav", {
        props: ["list", "navlocation"],
        template: '#site-nav',
        methods: {

            setLocation: function(item) {
                this.$emit("link_click", item.location);
            },
        },
    });

    Vue.component("page-main", {
        props: ["list"],
        template: '#page-main',
    });

    Vue.component("page-gallery", {
        props: ["list"],
        template: '#page-gallery',
        data: function() {
            return {
                galleryListHeight: 300,
                listAr: this.list
            }
        },
        mounted: function() {
            // this.$nextTick(function() {
            //     window.addEventListener("resize", this.setGalleryListHeight);
            //     this.setGalleryListHeight();
            // });
            
            window.addEventListener("resize", this.setGalleryListHeight);

            this.$http.get(
                'json/gallery.json'
            ).then(
                function(response) {
                    this.listAr = response.data;
                    this.$nextTick(function() {
                        this.setGalleryListHeight();
                    });
                }
            )
        },
        methods: {

            setGalleryListHeight: function() {
                //this.galleryListHeight = (this.$el.clientWidth / 3) / 1.5
                this.galleryListHeight = document.querySelector(".gallery__list-item").clientWidth / 1.5;
            }
        },
        watch: {

            list: function(val, oldval) {
                this.setGalleryListHeight();
            }
        }
    });

    var app = new Vue({
        el: "#app",
        data: {
            appLocation: "gallery",
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
                },
            ],
            sites: []
        },

        mounted: function() {
            // this.$http.get(
            //     'json/gallery.json'
            // ).then(
            //     function(response) {
            //         this.createArray(response.data);
            //     }
            // )
        },

        methods: {

            createArray: function(arr) {
                this.sites = arr;
            },

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


$(function () {

    Vue.component("site-nav", {
        props: ["list", "navlocation"],
        template: '#site-nav',
        methods: {

            setLocation: function (item) {
                console.log(item);
                this.$emit("link_click", item.location);
            }
        }
    });

    Vue.component("page-main", {
        props: ["list"],
        template: '#page-main'
    });

    Vue.component("page-gallery", {
        props: ["list"],
        template: '#page-gallery',
        data: function () {

            return {
                galleryListHeight: 300,
                listAr: this.list,
                displayHeight: ""
            };
        },
        mounted: function () {
            var self = this;

            window.addEventListener("resize", function () {
                self.setGalleryListHeight();
            });

            this.$http.get('json/gallery.json').then(function (response) {
                var data = response.data;
                var item = data[0];
                var arr = [];

                for (var i = 0; i < 20; i++) {

                    arr.push({
                        "name": "site1",
                        "href": "http://",
                        "imgsrc": "http://web-dev.pw/images/i_shop.jpg",
                        "gitlink": "http://",
                        "imgload": "false",
                        "visible": "false"
                    });
                }
                // for (var i = 0; i < 10; i++) {

                // 	for(var j = 0; j < data.length; j++) {
                // 		arr.push(data[j]);
                // 	}
                // }

                // arr.splice(arr.length - 1, 1);

                this.listAr = arr;

                this.$nextTick(function () {
                    this.setGalleryListHeight();
                });
            });
        },
        methods: {

            getDisplayHeight: function () {
                //this.displayHeight = 
            },

            setGalleryListHeight: function () {
                //this.galleryListHeight = (this.$el.clientWidth / 3) / 1.5
                this.galleryListHeight = document.querySelector(".gallery__list-item").clientWidth / 1.5;
            },

            loadImg: function () {
                var self = this;

                var img = new Image();
                img.onload = function () {
                    console.log("image is loaded");
                    console.log(self.listAr[2]);
                    self.listAr[2].imgload = "http://www.planwallpaper.com/static/images/Nikon-D810-Image-Sample-6.jpg";
                };
                img.src = "http://www.planwallpaper.com/static/images/Nikon-D810-Image-Sample-6.jpg";
            },

            checkVisible: function (e) {

                var screenH = document.documentElement.clientHeight;
                console.log(e.target.scrollTop);
                console.log(screenH);

                for (var i = 0; i < this.listAr.length; i++) {}
            }
        },
        watch: {

            list: function (val, oldval) {
                this.setGalleryListHeight();
            }
        }
    });

    var app = new Vue({
        el: "#app",
        data: {
            appLocation: "gallery",
            contentMove: true,
            links: [{
                name: "Main",
                href: "http://",
                location: "main"
            }, {
                name: "Gallery",
                href: "http://",
                location: "gallery"
            }],
            sites: []
        },

        mounted: function () {
            // this.$http.get(
            //     'json/gallery.json'
            // ).then(
            //     function(response) {
            //         this.createArray(response.data);
            //     }
            // )
        },

        methods: {

            createArray: function (arr) {
                this.sites = arr;
            },

            renderLocation: function (location) {
                console.log(location);
                this.appLocation = location;
            },

            headerMouseover: function () {
                this.contentMove = !this.contentMove;
                console.log(this.contentMove);
            },

            headerMouseout: function () {
                this.contentMove = !this.contentMove;
                console.log(this.contentMove);
            }
        }
    });
});
//# sourceMappingURL=app.js.map

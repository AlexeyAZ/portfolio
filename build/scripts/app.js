
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
            galleryColumn: 1,
            galleryScrollTop: 0,
            galleryHeight: null,
            galleryRowShow: 1
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

            for (var i = 0; i < 100; i++) {

                arr.push({
                    "name": "site1",
                    "href": "http://",
                    "imgsrc": "http://web-dev.pw/images/i_shop.jpg",
                    "gitlink": "http://",
                    "imgload": "false",
                    "visible": "false",
                    "top": "0"
                });
            }

            this.listAr = data;

            this.$nextTick(function () {
                this.setGalleryListHeight();
                this.setGalleryItemHeightAttr();
                this.galleryHeight = this.$el.querySelector(".gallery__list").scrollHeight;
                this.checkVisible();
            });
        });
    },
    methods: {

        setGalleryItemHeightAttr: function () {
            var coef = 1;
            var height = 1;

            for (var i = 0; i < this.listAr.length; i++) {

                if (i % this.galleryColumn === 0) {
                    coef++;
                }

                height = this.galleryListHeight * (coef - 1);
                this.listAr[i].top = height;
                console.log(height);
            }
        },

        setGalleryListHeight: function () {
            this.galleryListHeight = document.querySelector(".gallery__list-item").clientWidth / 1.5;
        },

        checkVisible: function (e) {

            var self = this;
            var rows = 0;
            var rowTop = 0;
            var coeff = 0;

            if (e) {
                this.galleryScrollTop = e.target.scrollTop;
            } else {
                this.galleryScrollTop = this.$el.querySelector(".gallery__list").scrollTop;
            }

            for (let i = 0; i < this.listAr.length; i++) {

                if (this.listAr[i].top !== rowTop) {
                    rowTop = this.listAr[i].top;
                    rows++;
                }
            }

            for (let i = 1; i <= rows; i++) {

                if (this.galleryListHeight * i - this.galleryScrollTop < document.documentElement.clientHeight) {

                    for (let j = 0; j < this.galleryColumn; j++) {
                        let number = j + coeff;

                        if (typeof this.listAr[number] !== "undefined" && this.listAr[number].visible === "false") {

                            let img = new Image();
                            img.onload = function () {
                                self.listAr[number].imgload = self.listAr[number].imgsrc;
                                self.listAr[number].visible = "true";
                            };
                            img.src = self.listAr[number].imgsrc;
                        }
                    }
                    coeff += this.galleryColumn;
                }
            }
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
//# sourceMappingURL=app.js.map
